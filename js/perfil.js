// ================================================================
// perfil.js — Página pública de emergencia (acceso por QR)
// Depende de: app.js (debe cargarse primero en el HTML)
// No requiere sesión activa.
// ================================================================

document.addEventListener('DOMContentLoaded', async function () {

    // 1. Leer el token UUID de la URL (?token=XXXX o ?id=XXXX por compatibilidad)
    const params = new URLSearchParams(window.location.search);
    const token  = params.get('token') || params.get('id');

    if (!token) {
        mostrarError();
        return;
    }

    try {
        const resp = await fetch(window.location.origin + '/api/publico/' + token);
        if (!resp.ok) { mostrarError(); return; }

        const data = await resp.json();
        if (!data.perfil) { mostrarError(); return; }

        // Adaptar nombres de campo del backend (snake_case) al formato que espera poblarPerfil
        const perfil = {
            nombre          : data.perfil.nombre,
            apellido        : data.perfil.apellido,
            tipoSangre      : data.perfil.tipo_sangre,
            fechaNacimiento : data.perfil.fecha_nacimiento,
            alergias        : data.perfil.alergias,
            enfermedades    : data.perfil.enfermedades,
            medicamentos    : data.perfil.medicamentos,
            direccion       : data.perfil.direccion,
            contactos       : data.contactos || []
        };

        poblarPerfil(perfil);

    } catch (err) {
        mostrarError();
    }
});

// ----------------------------------------------------------------
// mostrarError()
// Oculta el perfil y muestra la pantalla de error.
// ----------------------------------------------------------------
function mostrarError() {
    document.getElementById('pantalla-error').style.display = 'block';
    document.getElementById('pantalla-perfil').style.display = 'none';
    document.title = 'Perfil no encontrado — SafeTag QR';
}

// ----------------------------------------------------------------
// poblarPerfil(perfil)
// Recibe el objeto de perfil y llena todos los elementos del DOM.
// ----------------------------------------------------------------
function poblarPerfil(perfil) {
    document.getElementById('pantalla-perfil').style.display = 'block';
    document.getElementById('pantalla-error').style.display  = 'none';

    // Nombre completo en el título de la pestaña
    const nombreCompleto = (perfil.nombre + ' ' + perfil.apellido).trim();
    document.title = nombreCompleto + ' — SafeTag QR';

    // --- Identidad ---
    document.getElementById('p-nombre').textContent = nombreCompleto;
    document.getElementById('p-sangre').textContent = perfil.tipoSangre || '?';

    // Edad calculada a partir de la fecha de nacimiento
    document.getElementById('p-edad').textContent = calcularEdad(perfil.fechaNacimiento);

    // --- Datos médicos ---
    llenarCampo('p-alergias',     perfil.alergias,     true);   // true = destacar en rojo si tiene dato
    llenarCampo('p-enfermedades', perfil.enfermedades, false);
    llenarCampo('p-medicamentos', perfil.medicamentos, false);

    // --- Contactos de emergencia ---
    const contenedor = document.getElementById('p-contactos');
    const contactos  = perfil.contactos || [];

    if (contactos.length === 0) {
        contenedor.innerHTML = '<p style="color:var(--color-texto-suave); font-size:0.9rem; padding:0.5rem 0">No se registraron contactos de emergencia.</p>';
    } else {
        contactos.forEach(function (c, i) {
            contenedor.appendChild(crearTarjetaContacto(c, i));
        });
    }

    // --- Tooltips de datos médicos ---
    agregarTooltips(perfil);

    // --- Dirección (discreta, solo si fue ingresada) ---
    if (perfil.direccion && perfil.direccion.trim() !== '') {
        document.getElementById('p-direccion').textContent = perfil.direccion;
        document.getElementById('bloque-direccion').style.display = 'block';
    }
}

// ----------------------------------------------------------------
// llenarCampo(idElemento, valor, esAlerta)
// Coloca el valor en el elemento. Si está vacío muestra "No registrado".
// Si esAlerta=true y hay valor, lo pinta en rojo (alergia crítica).
// ----------------------------------------------------------------
function llenarCampo(idElemento, valor, esAlerta) {
    const el = document.getElementById(idElemento);
    if (!el) return;

    if (!valor || valor.trim() === '') {
        el.textContent = 'No registrado';
        el.classList.add('sin-dato');
    } else {
        el.textContent = valor.trim();
        if (esAlerta) el.classList.add('con-alerta');
    }
}

// ----------------------------------------------------------------
// crearTarjetaContacto(contacto, indice)
// Construye y devuelve el nodo DOM de una tarjeta de contacto
// con botón de llamada directa (tel:).
// ----------------------------------------------------------------
function crearTarjetaContacto(contacto, indice) {
    const avatares = ['👤', '👨‍👩‍👧', '👩', '👨'];
    const avatar   = avatares[indice] || '👤';

    const div = document.createElement('div');
    div.className = 'contacto-card';

    // Construir el número limpio para el enlace tel:
    const telLimpio = contacto.telefono ? contacto.telefono.replace(/\s|-/g, '') : '';

    div.innerHTML = `
        <div class="contacto-avatar">${avatar}</div>
        <div class="contacto-info">
            <div class="contacto-nombre">${escapeHTML(contacto.nombre || 'Sin nombre')}</div>
            <div class="contacto-parentesco">${escapeHTML(contacto.parentesco || '')} · ${escapeHTML(contacto.telefono || '')}</div>
        </div>
        ${telLimpio
            ? `<a href="tel:${telLimpio}" class="btn-llamar">📞 Llamar</a>`
            : '<span style="color:var(--color-texto-suave); font-size:0.82rem">Sin teléfono</span>'
        }
    `;

    return div;
}

// ----------------------------------------------------------------
// calcularEdad(fechaNacimiento)
// Recibe una fecha en formato "YYYY-MM-DD" y devuelve una cadena
// como "34 años" o "Fecha no registrada".
// ----------------------------------------------------------------
function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return 'Edad no registrada';

    const hoy     = new Date();
    const nacimiento = new Date(fechaNacimiento);

    if (isNaN(nacimiento.getTime())) return 'Fecha no registrada';

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesDif = hoy.getMonth() - nacimiento.getMonth();

    if (mesDif < 0 || (mesDif === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }

    return edad + ' años';
}

// ----------------------------------------------------------------
// TOOLTIPS DE DATOS MÉDICOS
// ----------------------------------------------------------------

const SANGRE_INFO = {
    'A+':         'Puede recibir de A+ y A−. Puede donar a A+ y AB+.',
    'A-':         'Puede recibir de A− y O−. Puede donar a A+, A−, AB+, AB−.',
    'B+':         'Puede recibir de B+ y B−. Puede donar a B+ y AB+.',
    'B-':         'Puede recibir de B− y O−. Puede donar a B+, B−, AB+, AB−.',
    'AB+':        'Receptor universal. Puede recibir de cualquier tipo de sangre.',
    'AB-':        'Puede recibir de AB−, A−, B−, O−. Puede donar a AB+ y AB−.',
    'O+':         'Puede recibir de O+ y O−. Puede donar a todos los tipos Rh positivo.',
    'O-':         'Donante universal. Puede donar a cualquier tipo de sangre.',
    'Desconocido':'Tipo de sangre no registrado. Consulte al personal médico antes de cualquier transfusión.'
};

// crearBtnTooltip(texto)
// Devuelve un span con un botón "ⓘ" que al hacer clic muestra
// un tooltip flotante. Funciona en desktop (hover) y móvil (click).
function crearBtnTooltip(texto) {
    const contenedor = document.createElement('span');
    contenedor.className = 'tooltip-contenedor';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tooltip-btn';
    btn.setAttribute('aria-label', 'Más información');
    btn.textContent = 'ⓘ';

    const caja = document.createElement('div');
    caja.className = 'tooltip-caja';
    caja.setAttribute('role', 'tooltip');
    caja.textContent = texto;

    btn.appendChild(caja);
    contenedor.appendChild(btn);

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const abierto = caja.style.display === 'block';
        cerrarTodosLosTooltips();
        if (!abierto) caja.style.display = 'block';
    });

    return contenedor;
}

function cerrarTodosLosTooltips() {
    document.querySelectorAll('.tooltip-caja').forEach(function (c) {
        c.style.display = 'none';
    });
}

// Cierra cualquier tooltip abierto al hacer clic fuera
document.addEventListener('click', cerrarTodosLosTooltips);

// agregarTooltips(perfil)
// Inserta los botones de tooltip en el DOM tras poblar el perfil.
function agregarTooltips(perfil) {
    // --- Tipo de sangre ---
    const hint = document.getElementById('p-sangre-hint');
    if (hint && perfil.tipoSangre && SANGRE_INFO[perfil.tipoSangre]) {
        const btn = crearBtnTooltip(SANGRE_INFO[perfil.tipoSangre]);
        hint.appendChild(btn);
    }

    // --- Alergias (solo si hay algo registrado) ---
    const labelAlergias = document.getElementById('label-alergias');
    if (labelAlergias && perfil.alergias && perfil.alergias.trim() !== '') {
        const btn = crearBtnTooltip(
            'Informa al personal médico de estas alergias antes de administrar cualquier medicamento o anestesia.'
        );
        labelAlergias.appendChild(btn);
    }
}

// ----------------------------------------------------------------
// escapeHTML(str)
// Previene XSS al insertar datos del usuario en innerHTML.
// ----------------------------------------------------------------
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
