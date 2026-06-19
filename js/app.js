/* ============================================================
   app.js — Funciones compartidas por TODAS las páginas
   Este archivo se incluye en cada HTML antes de los demás scripts.
   ============================================================ */

/* ----------------------------------------------------------
   CONSTANTES: nombres de las llaves en localStorage
   Se definen aquí para no escribirlas a mano en cada archivo
   y evitar errores de tipeo.
   ---------------------------------------------------------- */
const LLAVE_USUARIOS  = 'safetag_usuarios';   // Lista de usuarios registrados
const LLAVE_SESION    = 'safetag_sesion';      // Token del usuario con sesión activa
const PREFIJO_PERFIL  = 'safetag_perfil_';    // + UUID = datos completos del perfil

/* ----------------------------------------------------------
   GENERACIÓN DEL TOKEN (UUID)
   crypto.randomUUID() genera un identificador único como:
   "a3f8c2d1-9b4e-4f2a-8c1d-5e7f9a2b3c4d"
   Es tan aleatorio que es prácticamente imposible de adivinar.
   ---------------------------------------------------------- */
function generarToken() {
    return crypto.randomUUID();
}

/* ----------------------------------------------------------
   MANEJO DE USUARIOS EN localStorage
   ---------------------------------------------------------- */

/* Devuelve el array de usuarios registrados (o [] si no hay ninguno) */
function obtenerUsuarios() {
    const datos = localStorage.getItem(LLAVE_USUARIOS);
    return datos ? JSON.parse(datos) : [];
}

/* Guarda el array de usuarios en localStorage */
function guardarUsuarios(usuarios) {
    localStorage.setItem(LLAVE_USUARIOS, JSON.stringify(usuarios));
}

/* Busca un usuario por correo. Devuelve el usuario o null si no existe. */
function buscarUsuarioPorCorreo(correo) {
    const usuarios = obtenerUsuarios();
    return usuarios.find(u => u.correo === correo.toLowerCase()) || null;
}

/* ----------------------------------------------------------
   MANEJO DE PERFILES EN localStorage
   Cada perfil se guarda con su propio UUID como llave.
   ---------------------------------------------------------- */

/* Guarda el perfil completo de un usuario */
function guardarPerfil(token, perfil) {
    localStorage.setItem(PREFIJO_PERFIL + token, JSON.stringify(perfil));
}

/* Obtiene el perfil por token. Devuelve el perfil o null si no existe. */
function obtenerPerfil(token) {
    const datos = localStorage.getItem(PREFIJO_PERFIL + token);
    return datos ? JSON.parse(datos) : null;
}

/* ----------------------------------------------------------
   MANEJO DE SESIÓN
   ---------------------------------------------------------- */

/* Guarda el token del usuario que inició sesión */
function iniciarSesion(token) {
    localStorage.setItem(LLAVE_SESION, token);
}

/* Devuelve el token del usuario con sesión activa (o null si no hay sesión) */
function obtenerSesion() {
    return localStorage.getItem(LLAVE_SESION);
}

/* Cierra la sesión eliminando el token guardado */
function cerrarSesion() {
    localStorage.removeItem(LLAVE_SESION);
}

/* Devuelve el perfil del usuario con sesión activa (o null) */
function obtenerPerfilActual() {
    const token = obtenerSesion();
    if (!token) return null;
    return obtenerPerfil(token);
}

/* ----------------------------------------------------------
   PROTECCIÓN DE PÁGINAS PRIVADAS
   Llama esta función al inicio de panel.html para redirigir
   al login si el usuario no tiene sesión activa.
   ---------------------------------------------------------- */
function requerirSesion() {
    if (!obtenerSesion()) {
        window.location.href = 'login.html';
    }
}

/* ----------------------------------------------------------
   VALIDACIONES DE FORMULARIO
   ---------------------------------------------------------- */

/* Verifica que un texto no esté vacío */
function esVacio(valor) {
    return !valor || valor.trim() === '';
}

/* Verifica que un correo tenga formato válido (contiene @ y un punto después) */
function esCorreoValido(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

/* Verifica que la contraseña tenga al menos 6 caracteres */
function esPasswordValida(password) {
    return password && password.length >= 6;
}

/* ----------------------------------------------------------
   UTILIDADES DE INTERFAZ
   ---------------------------------------------------------- */

/* Muestra un mensaje de alerta en la página.
   Uso: mostrarAlerta('mi-alerta', 'Mensaje de error', 'error')
   Tipos: 'error', 'exito', 'info' */
function mostrarAlerta(idElemento, mensaje, tipo = 'error') {
    const el = document.getElementById(idElemento);
    if (!el) return;
    el.textContent = mensaje;
    el.className = `alerta alerta-${tipo}`;
    el.style.display = 'block';
}

/* Oculta una alerta */
function ocultarAlerta(idElemento) {
    const el = document.getElementById(idElemento);
    if (el) el.style.display = 'none';
}

/* Muestra un mensaje de error debajo de un campo de formulario.
   Uso: mostrarErrorCampo('campo-correo', 'El correo no es válido') */
function mostrarErrorCampo(idCampo, mensaje) {
    const errorEl = document.getElementById('error-' + idCampo);
    if (errorEl) {
        errorEl.textContent = mensaje;
        errorEl.style.display = 'block';
    }
    const campo = document.getElementById(idCampo);
    if (campo) campo.style.borderColor = 'var(--color-peligro)';
}

/* Limpia el error de un campo */
function limpiarErrorCampo(idCampo) {
    const errorEl = document.getElementById('error-' + idCampo);
    if (errorEl) errorEl.style.display = 'none';
    const campo = document.getElementById(idCampo);
    if (campo) campo.style.borderColor = '';
}

/* ----------------------------------------------------------
   ACTUALIZA EL NAVBAR SEGÚN SESIÓN
   Muestra "Mi panel / Cerrar sesión" si hay sesión activa,
   o "Registrarse / Iniciar sesión" si no la hay.
   Llama esta función en todas las páginas que tengan navbar.
   ---------------------------------------------------------- */
function actualizarNavbar() {
    const sesion = obtenerSesion();
    const enlaceRegistro = document.getElementById('nav-registro');
    const enlaceLogin    = document.getElementById('nav-login');
    const enlacePanel    = document.getElementById('nav-panel');
    const enlaceSalir    = document.getElementById('nav-salir');

    if (sesion) {
        if (enlaceRegistro) enlaceRegistro.style.display = 'none';
        if (enlaceLogin)    enlaceLogin.style.display    = 'none';
        if (enlacePanel)    enlacePanel.style.display    = '';
        if (enlaceSalir)    enlaceSalir.style.display    = '';
    } else {
        if (enlaceRegistro) enlaceRegistro.style.display = '';
        if (enlaceLogin)    enlaceLogin.style.display    = '';
        if (enlacePanel)    enlacePanel.style.display    = 'none';
        if (enlaceSalir)    enlaceSalir.style.display    = 'none';
    }

    // El enlace "Cerrar sesión" necesita un manejador de clic
    if (enlaceSalir) {
        enlaceSalir.addEventListener('click', function(e) {
            e.preventDefault();
            cerrarSesion();
            window.location.href = 'index.html';
        });
    }
}
