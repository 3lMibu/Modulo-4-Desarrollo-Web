// ================================================================
// registro.js — Lógica del formulario de registro SafeTag QR
// Depende de: app.js (debe cargarse primero en el HTML)
// ================================================================

// ----------------------------------------------------------------
// Estado: contador de contactos de emergencia mostrados
// ----------------------------------------------------------------
let totalContactos = 0;
const MAX_CONTACTOS = 3;

// ----------------------------------------------------------------
// Al cargar la página: crear el primer bloque de contacto
// y configurar los event listeners
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {

    // Primer contacto (obligatorio — no tiene botón de eliminar)
    agregarContacto(true);

    // Efecto: indicador de sección activa al hacer scroll
    iniciarIndicador();

    // Botón "Agregar otro contacto"
    document.getElementById('btn-agregar-contacto').addEventListener('click', function () {
        if (totalContactos < MAX_CONTACTOS) {
            agregarContacto(false);
        }
        // Ocultar el botón si ya llegamos al máximo
        if (totalContactos >= MAX_CONTACTOS) {
            this.style.display = 'none';
        }
    });

    // Envío del formulario
    document.getElementById('form-registro').addEventListener('submit', function (e) {
        e.preventDefault();   // evitar recarga de página
        procesarRegistro();
    });
});

// ----------------------------------------------------------------
// iniciarIndicador()
// Observa las 3 secciones del formulario con IntersectionObserver
// y actualiza el indicador de pasos según cuál está en pantalla.
// ----------------------------------------------------------------
function iniciarIndicador() {
    const secciones = [
        document.getElementById('form-seccion-1'),
        document.getElementById('form-seccion-2'),
        document.getElementById('form-seccion-3')
    ];

    if (!secciones[0]) return;

    const items = [
        document.getElementById('ind-1'),
        document.getElementById('ind-2'),
        document.getElementById('ind-3')
    ];

    const seps = [
        document.getElementById('sep-1-2'),
        document.getElementById('sep-2-3')
    ];

    function activar(indice) {
        // indice 0-based: 0 = sección 1, 1 = sección 2, 2 = sección 3
        items.forEach(function (item, i) {
            item.classList.toggle('activo', i <= indice);
        });
        seps.forEach(function (sep, i) {
            sep.classList.toggle('completo', i < indice);
        });
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const idx = secciones.indexOf(entry.target);
                if (idx !== -1) activar(idx);
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: '-80px 0px -50% 0px'
    });

    secciones.forEach(function (s) { if (s) observer.observe(s); });
}

// ----------------------------------------------------------------
// agregarContacto(esPrimero)
// Crea dinámicamente un bloque de formulario para un contacto.
// esPrimero: true → no muestra botón de eliminar
// ----------------------------------------------------------------
function agregarContacto(esPrimero) {
    totalContactos++;
    const numero = totalContactos;
    const contenedor = document.getElementById('contactos-contenedor');

    const bloque = document.createElement('div');
    bloque.className = 'contacto-bloque';
    bloque.id = 'contacto-' + numero;

    bloque.innerHTML = `
        <div class="contacto-bloque-titulo">
            Contacto ${numero}${esPrimero ? ' <span style="font-weight:400; color:var(--color-texto-suave)">(obligatorio)</span>' : ''}
        </div>
        ${!esPrimero ? `<button type="button" class="btn-eliminar-contacto" onclick="eliminarContacto(${numero})" title="Eliminar contacto">✕</button>` : ''}
        <div class="form-grid-2">
            <div class="form-grupo">
                <label for="contacto-nombre-${numero}">Nombre completo ${esPrimero ? '*' : ''}</label>
                <input type="text" id="contacto-nombre-${numero}" placeholder="Ej: María García">
            </div>
            <div class="form-grupo">
                <label for="contacto-parentesco-${numero}">Parentesco ${esPrimero ? '*' : ''}</label>
                <input type="text" id="contacto-parentesco-${numero}" placeholder="Ej: Mamá, esposo, hijo">
            </div>
        </div>
        <div class="form-grupo">
            <label for="contacto-telefono-${numero}">Teléfono ${esPrimero ? '*' : ''}</label>
            <input type="tel" id="contacto-telefono-${numero}" placeholder="Ej: 7890-1234">
        </div>
    `;

    contenedor.appendChild(bloque);
}

// ----------------------------------------------------------------
// eliminarContacto(numero)
// Elimina un bloque de contacto del DOM y actualiza el contador.
// Solo aplica a contactos 2 y 3 (el 1 es obligatorio).
// ----------------------------------------------------------------
function eliminarContacto(numero) {
    const bloque = document.getElementById('contacto-' + numero);
    if (bloque) {
        bloque.remove();
        totalContactos--;
        // Mostrar de nuevo el botón de agregar si quedó espacio
        if (totalContactos < MAX_CONTACTOS) {
            document.getElementById('btn-agregar-contacto').style.display = '';
        }
    }
}

// ----------------------------------------------------------------
// recogerContactos()
// Lee los valores de todos los bloques de contacto que existan
// en el DOM y los devuelve como array de objetos.
// ----------------------------------------------------------------
function recogerContactos() {
    const contactos = [];

    for (let i = 1; i <= 3; i++) {
        const bloque = document.getElementById('contacto-' + i);
        if (!bloque) continue;   // ese bloque fue eliminado

        const nombre      = document.getElementById('contacto-nombre-' + i)?.value.trim() || '';
        const parentesco  = document.getElementById('contacto-parentesco-' + i)?.value.trim() || '';
        const telefono    = document.getElementById('contacto-telefono-' + i)?.value.trim() || '';

        // Solo incluir si al menos tiene nombre y teléfono
        if (nombre || telefono) {
            contactos.push({ nombre, parentesco, telefono });
        }
    }

    return contactos;
}

// ----------------------------------------------------------------
// validarFormulario()
// Valida todos los campos. Devuelve true si todo está bien,
// false si hay errores (y los muestra en pantalla).
// ----------------------------------------------------------------
function validarFormulario() {
    let valido = true;

    // Limpiar errores previos
    ['nombre','apellido','telefono','correo','password',
     'password-confirmar','tipo-sangre','terminos'].forEach(id => {
        limpiarErrorCampo(id);
    });
    ocultarAlerta('alerta-registro');
    limpiarErrorCampo('contactos');

    // --- Datos personales ---
    if (esVacio(document.getElementById('nombre').value)) {
        mostrarErrorCampo('nombre', 'El nombre es obligatorio.');
        valido = false;
    }

    if (esVacio(document.getElementById('apellido').value)) {
        mostrarErrorCampo('apellido', 'El apellido es obligatorio.');
        valido = false;
    }

    if (esVacio(document.getElementById('telefono').value)) {
        mostrarErrorCampo('telefono', 'El teléfono es obligatorio.');
        valido = false;
    }

    const correo = document.getElementById('correo').value.trim();
    if (esVacio(correo)) {
        mostrarErrorCampo('correo', 'El correo es obligatorio.');
        valido = false;
    } else if (!esCorreoValido(correo)) {
        mostrarErrorCampo('correo', 'Ingresa un correo electrónico válido.');
        valido = false;
    }

    const pass = document.getElementById('password').value;
    if (!esPasswordValida(pass)) {
        mostrarErrorCampo('password', 'La contraseña debe tener al menos 6 caracteres.');
        valido = false;
    }

    const passConfirmar = document.getElementById('password-confirmar').value;
    if (esVacio(passConfirmar)) {
        mostrarErrorCampo('password-confirmar', 'Confirma tu contraseña.');
        valido = false;
    } else if (pass !== passConfirmar) {
        mostrarErrorCampo('password-confirmar', 'Las contraseñas no coinciden.');
        valido = false;
    }

    // --- Perfil médico ---
    if (esVacio(document.getElementById('tipo-sangre').value)) {
        mostrarErrorCampo('tipo-sangre', 'Selecciona tu tipo de sangre.');
        valido = false;
    }

    // --- Contacto de emergencia (mínimo 1 completo) ---
    const contacto1Nombre   = document.getElementById('contacto-nombre-1')?.value.trim() || '';
    const contacto1Telefono = document.getElementById('contacto-telefono-1')?.value.trim() || '';

    if (esVacio(contacto1Nombre) || esVacio(contacto1Telefono)) {
        mostrarErrorCampo('contactos', 'El primer contacto de emergencia (nombre y teléfono) es obligatorio.');
        valido = false;
    }

    // --- Consentimiento ---
    if (!document.getElementById('acepto-terminos').checked) {
        mostrarErrorCampo('terminos', 'Debes aceptar el aviso de privacidad para continuar.');
        valido = false;
    }

    return valido;
}

// ----------------------------------------------------------------
// procesarRegistro()
// Función principal: valida → llama API → muestra QR
// ----------------------------------------------------------------
async function procesarRegistro() {
    if (!validarFormulario()) {
        const primerError = document.querySelector('.form-error:not(:empty), .form-error[style*="block"]');
        if (primerError) {
            primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    const btnSubmit = document.querySelector('#form-registro button[type="submit"]');
    if (btnSubmit) { btnSubmit.disabled = true; btnSubmit.textContent = 'Guardando...'; }

    const nombre      = document.getElementById('nombre').value.trim();
    const apellido    = document.getElementById('apellido').value.trim();
    const fechaNac    = document.getElementById('fecha-nacimiento').value;
    const direccion   = document.getElementById('direccion').value.trim();
    const correo      = document.getElementById('correo').value.trim().toLowerCase();
    const password    = document.getElementById('password').value;
    const tipoSangre  = document.getElementById('tipo-sangre').value;
    const alergias    = document.getElementById('alergias').value.trim();
    const enfermedades= document.getElementById('enfermedades').value.trim();
    const medicamentos= document.getElementById('medicamentos').value.trim();
    const contactos   = recogerContactos();

    try {
        const resp = await fetch(window.location.origin + '/api/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo,
                password,
                nombre: nombre + ' ' + apellido,
                perfil: {
                    nombre,
                    apellido,
                    fecha_nacimiento : fechaNac || null,
                    tipo_portador    : 'persona',
                    tipo_sangre      : tipoSangre,
                    alergias,
                    enfermedades,
                    medicamentos,
                    direccion
                },
                contactos
            })
        });

        const data = await resp.json();

        if (!resp.ok) {
            mostrarAlerta('alerta-registro', data.error || 'No se pudo completar el registro.');
            return;
        }

        // Guardar sesión y mostrar pantalla de éxito con el token real de la BD
        sessionStorage.setItem('usuario', JSON.stringify({ id: data.id, nombre: nombre + ' ' + apellido, correo }));
        mostrarPantallaExito(data.token);

    } catch (err) {
        mostrarAlerta('alerta-registro', 'No se pudo conectar con el servidor. Verifica que el backend esté en línea (puerto 3001).');
    } finally {
        if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.textContent = 'Crear cuenta'; }
    }
}

// ----------------------------------------------------------------
// mostrarPantallaExito(token)
// Oculta el formulario, muestra la pantalla de éxito con el QR.
// ----------------------------------------------------------------
async function mostrarPantallaExito(token) {
    // Ocultar formulario y disclaimer
    document.getElementById('form-registro').style.display = 'none';
    document.getElementById('alerta-registro').style.display = 'none';

    // Mostrar pantalla de éxito
    const pantalla = document.getElementById('pantalla-exito');
    pantalla.style.display = 'block';

    // URL que codificará el QR — quien la abra en el celular verá el perfil.
    // Se usa href (no origin) para que funcione tanto en file:// como en http://
    // Obtener IP de red del servidor para que el QR sea accesible desde cualquier dispositivo
    let baseUrl = window.location.origin;
    try {
        const r = await fetch(window.location.origin + '/api/server-url');
        const d = await r.json();
        if (d.url) baseUrl = d.url;
    } catch (_) { /* si falla, usa localhost */ }
    const urlPerfil = baseUrl + '/perfil.html?token=' + token;

    // Generar el código QR visualmente usando qrcode.js
    new QRCode(document.getElementById('qr-codigo'), {
        text       : urlPerfil,
        width      : 200,
        height     : 200,
        colorDark  : '#1F4E78',   // color primario del proyecto
        colorLight : '#FFFFFF',
        correctLevel: QRCode.CorrectLevel.H   // nivel alto de corrección de errores
    });

    // Scroll a la pantalla de éxito
    pantalla.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Actualizar navbar (ahora hay sesión activa)
    actualizarNavbar();
}

// ----------------------------------------------------------------
// imprimirQR()
// Abre el diálogo de impresión del navegador enfocado en el QR.
// Se llama desde el botón en la pantalla de éxito.
// ----------------------------------------------------------------
function imprimirQR() {
    window.print();
}
