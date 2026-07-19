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
        res.status(201).json({ mensaje: 'Registro exitoso', token: pulsera.rows[0].token });
    } catch (err) {
        await cliente.query('ROLLBACK');
        res.status(500).json({ error: 'No se pudo completar el registro' });
    } finally {
        cliente.release();
    }
}

module.exports = { obtenerPerfilPublico, registrar };
