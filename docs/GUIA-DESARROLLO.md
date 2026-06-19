# Guía de Desarrollo — SafeTag QR

Esta guía explica cómo está organizado el proyecto, qué hace cada archivo y cómo seguir el desarrollo paso a paso. Está escrita para que cualquier integrante del equipo, sin importar su nivel técnico, pueda entender qué se hizo, por qué se hizo así, y cómo continuar.

---

## ¿Qué es este proyecto?

SafeTag QR es un sitio web donde las personas se registran con su información personal, médica y contactos de emergencia. El sistema les genera un código QR único. Si esa persona sufre un accidente o se extravía, quien la encuentre puede escanear el QR y acceder a su información de contacto de inmediato, sin necesidad de tener cuenta ni contraseña.

---

## Cómo abrir y probar el proyecto

No se necesita instalar nada especial. Solo:

1. Descargar o clonar el repositorio desde GitHub.
2. Abrir la carpeta del proyecto.
3. Hacer doble clic en `index.html`.
4. El sitio abre directo en el navegador.

> El proyecto funciona completamente en el navegador. No necesita internet para la mayoría de funciones (excepto si se usa Firebase en el futuro).

---

## Estructura de archivos

```
proyecto/
│
├── index.html          → Página principal (landing page pública)
├── como-funciona.html  → Explicación del sistema para nuevos visitantes
├── registro.html       → Formulario para crear una cuenta nueva
├── login.html          → Formulario para iniciar sesión
├── panel.html          → Panel privado del usuario (ver/editar datos, ver QR)
├── perfil.html         → Página pública que se muestra al escanear el QR
│
├── css/
│   └── styles.css      → Todos los estilos visuales del sitio
│
├── js/
│   ├── app.js          → Funciones compartidas por todas las páginas
│   ├── registro.js     → Lógica del formulario de registro
│   ├── login.js        → Lógica del inicio de sesión
│   ├── panel.js        → Lógica del panel privado del usuario
│   └── perfil.js       → Lógica de la página pública del QR
│
└── docs/
    ├── Primera entrega/    → Documentos de la primera entrega
    ├── Segunda entrega/    → Documentos de la segunda entrega
    └── GUIA-DESARROLLO.md  → Este archivo
```

---

## Cómo funciona el TOKEN (concepto clave)

El token resuelve el problema de privacidad: que la información de una persona no sea buscable en Google ni accesible a cualquiera, pero sí accesible para quien tenga la pulsera.

### El problema sin token

Si la URL fuera `perfil.html?id=1`, `perfil.html?id=2`, `perfil.html?id=3`... cualquiera podría probar números y ver todos los perfiles. Eso es inaceptable para datos médicos.

### La solución: UUID como token

Cuando el usuario se registra, el sistema genera automáticamente un **UUID** (Identificador Único Universal). Se ve así:

```
a3f8c2d1-9b4e-4f2a-8c1d-5e7f9a2b3c4d
```

Es un código de 32 caracteres aleatorios. Hay más combinaciones posibles que átomos en la Tierra — nadie puede adivinarlo ni enumerarlos.

La URL del perfil queda así:

```
perfil.html?id=a3f8c2d1-9b4e-4f2a-8c1d-5e7f9a2b3c4d
```

Esa URL es la que se codifica dentro del código QR de la pulsera. Solo quien tenga físicamente la pulsera (y por lo tanto el QR) puede llegar a esa página.

### En código (una línea de JavaScript)

```javascript
const token = crypto.randomUUID();
// Resultado: "a3f8c2d1-9b4e-4f2a-8c1d-5e7f9a2b3c4d"
// crypto.randomUUID() es una función nativa del navegador, no requiere librerías.
```

---

## Dónde se guardan los datos (localStorage)

Para este prototipo académico, los datos se guardan en `localStorage` — un espacio de almacenamiento dentro del mismo navegador, sin necesidad de servidor.

### Limitación importante (para tener en cuenta)

Los datos guardados en `localStorage` solo existen en el navegador y dispositivo donde se registró el usuario. Si alguien escanea el QR desde otro celular, ese celular no tendrá los datos.

**Esto es aceptable para el prototipo del módulo.** Para un producto real, se usaría Firebase o una base de datos en la nube.

### Cómo se organiza la información en localStorage

```
localStorage
├── safetag_usuarios          → Lista de todos los usuarios registrados
│     [{ id, correo, nombre, password }, ...]
│
└── safetag_perfil_XXXXX      → Perfil completo de cada usuario (por su token UUID)
      {
        token: "a3f8c2d1-...",
        nombre: "Juan Pérez",
        tipoSangre: "O+",
        alergias: "Penicilina",
        contactos: [{ nombre: "María", parentesco: "esposa", telefono: "555-1234" }],
        ...
      }
```

---

## Flujo completo del sistema

```
1. Visitante llega a index.html
        ↓
2. Hace clic en "Registrarse"
        ↓
3. Llena registro.html (datos personales, médicos, contactos)
        ↓
4. El sistema genera un UUID único para ese usuario
        ↓
5. Se guardan los datos en localStorage con ese UUID como llave
        ↓
6. Se genera un código QR que apunta a:
   perfil.html?id=UUID
        ↓
7. El usuario imprime/guarda ese QR y lo pone en su pulsera/llavero
        ↓
8. En caso de emergencia, alguien escanea el QR con su celular
        ↓
9. Se abre perfil.html?id=UUID en el celular del rescatista
        ↓
10. La página lee el UUID de la URL, busca el perfil en localStorage
    y muestra: nombre, tipo de sangre, alergias, medicamentos y contactos
```

---

## Páginas del sitio — resumen de responsabilidades

### index.html — Landing page
- Presenta el proyecto al visitante.
- Explica en pocas palabras para qué sirve.
- Botones: "Registrarse" y "Iniciar sesión".
- No requiere estar autenticado.

### como-funciona.html — Explicación
- Guía paso a paso con íconos o imágenes.
- Explica el proceso: registro → QR → pulsera → escaneo.

### registro.html — Crear cuenta
- Formulario en secciones: datos personales, perfil médico, contactos de emergencia.
- Al enviar: valida los campos, genera UUID, guarda en localStorage, redirige al panel.

### login.html — Iniciar sesión
- Formulario: correo + contraseña.
- Busca el usuario en localStorage, valida contraseña, redirige al panel.

### panel.html — Panel privado *(requiere sesión)*
- Muestra los datos del usuario.
- Permite editar información.
- Muestra el código QR generado.
- Botón para descargar o imprimir el QR.

### perfil.html — Vista pública *(acceso por QR)*
- Lee el `?id=UUID` de la URL.
- Busca el perfil en localStorage.
- Muestra: nombre, tipo de sangre, alergias, medicamentos, contactos.
- No muestra: contraseña, correo, ni información privada.
- Si el UUID no existe: muestra mensaje de error.

---

## Paleta de colores del sitio

Para mantener consistencia visual, todo el sitio usa estas variables en CSS:

```css
--color-primario:    #1F4E78;   /* Azul oscuro — encabezados, navbar */
--color-secundario:  #2E75B6;   /* Azul medio — botones secundarios */
--color-acento:      #00A896;   /* Verde azulado — éxito, QR, badges */
--color-alerta:      #F4A261;   /* Ámbar — llamadas a la acción */
--color-peligro:     #E63946;   /* Rojo — errores, alertas médicas */
--color-fondo:       #F8F9FA;   /* Gris claro — fondo de página */
--color-texto:       #212529;   /* Casi negro — texto principal */
```

---

## Librería externa: qrcode.js

Para generar el código QR visualmente en el navegador, se usa la librería `qrcode.js`. Se incluye con una sola línea en el HTML — no requiere instalación.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
```

Uso en JavaScript:

```javascript
// Genera un QR dentro del elemento con id="qr-container"
new QRCode(document.getElementById("qr-container"), {
    text: "https://misitio.com/perfil.html?id=" + token,
    width: 200,
    height: 200
});
```

---

## Control de versiones (Git)

El proyecto se entrega a través de GitHub. Cada vez que se sube un avance:

```bash
git add nombre-del-archivo.html
git commit -m "descripción breve de qué se hizo"
git push origin main
```

Los archivos que NUNCA se suben al repositorio (ya configurado en `.gitignore`):
- `node_modules/` — librerías de Node, muy pesadas y se pueden reinstalar
- `docs/02-bitacora-prompts.md` — notas personales de prompts

---

## Estado actual del proyecto

| Entrega | Estado | Contenido |
|---|---|---|
| Primera entrega | Pendiente de formalizar | Definición del proyecto (4 preguntas) |
| Segunda entrega | Completa | Diagrama de navegación, organigrama, clases UML |
| Tercera entrega | En construcción | Prototipo funcional HTML/CSS/JS |

---

*Documento mantenido por el equipo. Actualizar conforme avance el desarrollo.*
