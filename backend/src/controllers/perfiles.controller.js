const pool = require('../config/db');
const bcrypt = require('bcrypt');

// GET /api/publico/:token — consulta pública sin autenticación
async function obtenerPerfilPublico(req, res) {
    const { token } = req.params;
    try {
        const pulsera = await pool.query(
            "SELECT id FROM pulseras WHERE token = $1 AND estado = 'activa'",
            [token]
        );
        if (pulsera.rows.length === 0) {
            return res.status(404).json({ error: 'Perfil no encontrado' });
        }
        const pulseraId = pulsera.rows[0].id;

        const perfil = await pool.query(
            'SELECT * FROM perfiles WHERE pulsera_id = $1',
            [pulseraId]
        );
        const contactos = await pool.query(
            'SELECT nombre, parentesco, telefono FROM contactos_emergencia WHERE pulsera_id = $1 LIMIT 3',
            [pulseraId]
        );
        res.json({ perfil: perfil.rows[0], contactos: contactos.rows });
    } catch (err) {
        res.status(500).json({ error: 'Error al consultar el perfil' });
    }
}

// POST /api/registro — crea cuenta + pulsera + perfil + contactos (transacción ACID)
async function registrar(req, res) {
    const cliente = await pool.connect();
    try {
        const { correo, password, nombre, perfil, contactos } = req.body;
        const hash = await bcrypt.hash(password, 10);

        await cliente.query('BEGIN');

        const usuario = await cliente.query(
            'INSERT INTO usuarios (correo, password_hash, nombre) VALUES ($1, $2, $3) RETURNING id',
            [correo, hash, nombre]
        );
        const pulsera = await cliente.query(
            'INSERT INTO pulseras (usuario_id) VALUES ($1) RETURNING id, token',
            [usuario.rows[0].id]
        );
        const pulseraId = pulsera.rows[0].id;

        await cliente.query(
            `INSERT INTO perfiles (nombre, apellido, fecha_nacimiento, tipo_portador,
             tipo_sangre, alergias, enfermedades, medicamentos, direccion, pulsera_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            [perfil.nombre, perfil.apellido, perfil.fecha_nacimiento, perfil.tipo_portador || 'persona',
             perfil.tipo_sangre, perfil.alergias, perfil.enfermedades, perfil.medicamentos,
             perfil.direccion, pulseraId]
        );

        for (const c of (contactos || [])) {
            await cliente.query(
                'INSERT INTO contactos_emergencia (nombre, parentesco, telefono, pulsera_id) VALUES ($1,$2,$3,$4)',
                [c.nombre, c.parentesco, c.telefono, pulseraId]
            );
        }

        await cliente.query('COMMIT');
        res.status(201).json({
            mensaje : 'Registro exitoso',
            token   : pulsera.rows[0].token,
            id      : usuario.rows[0].id
        });
    } catch (err) {
        await cliente.query('ROLLBACK');
        res.status(500).json({ error: 'No se pudo completar el registro' });
    } finally {
        cliente.release();
    }
}

// POST /api/login — verifica credenciales con bcrypt
async function login(req, res) {
    const { correo, password } = req.body;
    if (!correo || !password) {
        return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }
    try {
        const resultado = await pool.query(
            'SELECT id, nombre, correo, password_hash FROM usuarios WHERE correo = $1',
            [correo.toLowerCase()]
        );
        if (resultado.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        const usuario = resultado.rows[0];
        const coincide = await bcrypt.compare(password, usuario.password_hash);
        if (!coincide) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        res.json({ id: usuario.id, nombre: usuario.nombre, correo: usuario.correo });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// GET /api/mis-pulseras?usuario_id=X — lista pulseras del usuario con su perfil
async function misPulseras(req, res) {
    const { usuario_id } = req.query;
    if (!usuario_id) {
        return res.status(400).json({ error: 'usuario_id requerido' });
    }
    try {
        const resultado = await pool.query(
            `SELECT p.id, p.token, p.estado, p.fecha_creacion,
                    pr.nombre, pr.apellido, pr.tipo_sangre, pr.tipo_portador
             FROM pulseras p
             LEFT JOIN perfiles pr ON pr.pulsera_id = p.id
             WHERE p.usuario_id = $1
             ORDER BY p.fecha_creacion DESC`,
            [usuario_id]
        );
        res.json({ pulseras: resultado.rows });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener pulseras' });
    }
}

// POST /api/pulseras — agrega pulsera+perfil a un usuario ya existente
async function agregarPulsera(req, res) {
    const cliente = await pool.connect();
    try {
        const { usuario_id, perfil, contactos } = req.body;
        if (!usuario_id) return res.status(400).json({ error: 'usuario_id requerido' });

        await cliente.query('BEGIN');

        const pulsera = await cliente.query(
            'INSERT INTO pulseras (usuario_id) VALUES ($1) RETURNING id, token',
            [usuario_id]
        );
        const pulseraId = pulsera.rows[0].id;

        await cliente.query(
            `INSERT INTO perfiles (nombre, apellido, fecha_nacimiento, tipo_portador,
             tipo_sangre, alergias, enfermedades, medicamentos, direccion, pulsera_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            [perfil.nombre, perfil.apellido, perfil.fecha_nacimiento || null,
             perfil.tipo_portador || 'persona', perfil.tipo_sangre,
             perfil.alergias, perfil.enfermedades, perfil.medicamentos,
             perfil.direccion, pulseraId]
        );

        for (const c of (contactos || [])) {
            await cliente.query(
                'INSERT INTO contactos_emergencia (nombre, parentesco, telefono, pulsera_id) VALUES ($1,$2,$3,$4)',
                [c.nombre, c.parentesco, c.telefono, pulseraId]
            );
        }

        await cliente.query('COMMIT');
        res.status(201).json({ token: pulsera.rows[0].token });
    } catch (err) {
        await cliente.query('ROLLBACK');
        res.status(500).json({ error: 'No se pudo crear la pulsera' });
    } finally {
        cliente.release();
    }
}

module.exports = { obtenerPerfilPublico, registrar, login, misPulseras, agregarPulsera };
