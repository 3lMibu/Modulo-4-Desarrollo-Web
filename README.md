# SafeTag QR — Sistema de Asistencia en Emergencias

Plataforma web que permite a las personas registrar su información personal, médica y contactos de emergencia, y obtener un código QR único para llevar en una pulsera, llavero o collar de mascota. Al escanear el código en una emergencia, cualquier persona accede a esa información desde su celular, sin necesidad de tener una cuenta ni conexión especial.

Proyecto desarrollado para el **Módulo 4 — Desarrollo Web**, Universidad Dr. Andrés Bello (UNAB), 2026.

---

## Integrantes del equipo

| Nombre |
|---|
| Alejandro De Jesús Linares Marroquín |
| Miguel Daniel Reyes Martínez |
| Nathalie Jeannette Sibrián Pérez |
| Vladimir Natanael Villalobos Vega |

---

## Tabla de contenidos

1. [Tecnologías utilizadas](#tecnologías-utilizadas)
2. [Cómo abrir el proyecto](#cómo-abrir-el-proyecto)
3. [Estructura de archivos](#estructura-de-archivos)
4. [Paleta de colores](#paleta-de-colores)
5. [Vistas del sitio — funcionamiento y lógica](#vistas-del-sitio--funcionamiento-y-lógica)
6. [Cómo funciona el token de seguridad](#cómo-funciona-el-token-de-seguridad)
7. [Almacenamiento de datos](#almacenamiento-de-datos)
8. [Frameworks y librerías externas](#frameworks-y-librerías-externas)
9. [Diagramas del sistema](#diagramas-del-sistema)

---

## Tecnologías utilizadas

Este es un proyecto **100% frontend** — no requiere servidor, base de datos ni instalación de dependencias.

| Categoría | Tecnología | Uso |
|---|---|---|
| Estructura | HTML5 | Todas las páginas del sitio |
| Estilos | CSS3 con variables personalizadas | Sistema de diseño centralizado en `styles.css` |
| Lógica | JavaScript vanilla (ES6+) | Validación, almacenamiento, generación de QR, efectos |
| Almacenamiento | `localStorage` del navegador | Simula la base de datos del prototipo |
| QR | `qrcode.js` vía CDN | Genera el código QR en el navegador, sin instalación |
| Animaciones | Claude Design (Anthropic) | Bundles HTML/CSS/JS autónomos embebidos vía `<iframe>` |
| Control de versiones | Git & GitHub | Colaboración y entrega del proyecto |

> **Nota sobre el alcance del prototipo:** Este proyecto usa `localStorage` para simular el almacenamiento de datos, lo que significa que los registros existen únicamente en el navegador donde se creó la cuenta. En un sistema de producción real, esto sería reemplazado por una base de datos en la nube (Firebase, Supabase, etc.) con autenticación segura.

---

## Cómo abrir el proyecto

No se requiere instalación ni servidor. Solo:

1. Clonar o descargar el repositorio.
2. Abrir la carpeta del proyecto.
3. Hacer doble clic en `index.html`.

El sitio se abre directamente en el navegador. No necesita servidor local ni npm. La única dependencia externa es `qrcode.js`, que se carga desde CDN solo al momento de generar el QR (requiere conexión a internet en ese paso).

---

## Estructura de archivos

```
proyecto/
│
├── index.html                    Página principal — landing page pública
├── como-funciona.html            Explicación del sistema en 4 pasos
├── animacion-como-funciona.html  Animación embebida (bundle autónomo — Claude Design)
├── historias.html                Casos de uso narrativos
├── animacion-historias.html      Animación de historias (bundle autónomo — 4 historias)
├── registro.html                 Formulario de registro — crea cuenta y genera QR
├── perfil.html                   Vista pública de emergencia (se abre al escanear el QR)
├── login.html                    Inicio de sesión (en desarrollo)
├── panel.html                    Panel privado del usuario (en desarrollo)
│
├── css/
│   └── styles.css                Sistema de diseño completo — variables, componentes, responsive
│
├── js/
│   ├── app.js                    Funciones compartidas por todas las páginas
│   ├── registro.js               Lógica del formulario de registro
│   └── perfil.js                 Lógica de la página pública de emergencia
│
└── docs/
    ├── Primera entrega/          Definición del proyecto
    └── Segunda entrega/          Diagramas de navegación y clases UML (PDF)
```

---

## Paleta de colores

Todo el sitio usa un sistema de variables CSS definido en `css/styles.css`. Editar las variables en `:root` cambia el look completo del sitio.

| Variable | Color | Uso principal |
|---|---|---|
| `--color-primario` | `#1F4E78` — Azul oscuro | Navbar, títulos, encabezados, círculo de tipo de sangre |
| `--color-secundario` | `#2E75B6` — Azul medio | Gradientes, gradientes de secciones |
| `--color-acento` | `#00A896` — Verde azulado | Éxito, botón Llamar, QR generado, badges |
| `--color-alerta` | `#F4A261` — Ámbar/naranja | Botones de llamada a acción (CTA), pasos numerados |
| `--color-peligro` | `#E63946` — Rojo | Errores de formulario, círculo de sangre, alergias |
| `--color-fondo` | `#F8F9FA` — Gris muy claro | Fondo general de página |
| `--color-superficie` | `#FFFFFF` — Blanco | Tarjetas, formularios, fondos de sección |
| `--color-texto` | `#212529` — Casi negro | Texto principal |
| `--color-texto-suave` | `#6C757D` — Gris medio | Texto secundario, etiquetas, descripciones |
| `--color-borde` | `#DEE2E6` — Gris claro | Bordes de inputs y separadores |

**Decisión de diseño:** La paleta usa dos registros emocionales. El azul primario transmite **confianza y seguridad médica**. El ámbar/naranja en los botones de acción transmite **urgencia positiva** — invita a actuar sin generar alarma. El rojo queda reservado exclusivamente para alertas reales (errores y datos críticos de emergencia).

---

## Vistas del sitio — funcionamiento y lógica

### `index.html` — Página principal

**Propósito:** Primera impresión del sitio. Convencer al visitante de registrarse mostrando el valor emocional del sistema.

**Estructura de secciones:**
1. Hero con título, subtítulo y dos botones (registrarse / cómo funciona)
2. Animación de historias reales (iframe 16:9, carga inmediata — `loading="eager"`)
3. Tres tarjetas de características del sistema
4. Cuatro pasos resumidos del proceso
5. Tres mini-historias de casos de uso con desenlace (niño, runner, anciana)
6. CTA final hacia el formulario de registro

**Lógica JS:** Llama únicamente a `actualizarNavbar()` desde `app.js`, que detecta si hay sesión activa y muestra u oculta los enlaces correspondientes (Mi panel / Cerrar sesión vs. Registrarse / Iniciar sesión).

---

### `como-funciona.html` — Cómo funciona

**Propósito:** Explicar el proceso completo de uso en lenguaje claro y sin ambigüedad.

**Estructura de secciones:**
1. Animación de los 4 pasos (iframe 16:9, bundle autónomo)
2. Cuatro tarjetas de pasos numerados con descripción detallada
3. Grilla de casos de uso: niños, adultos mayores, mascotas, deportistas
4. Bloque de cierre con CTA hacia el registro

**Lógica JS:** Solo `actualizarNavbar()`.

---

### `historias.html` — Historias reales

**Propósito:** Mostrar el impacto emocional del sistema con narrativas concretas para distintos perfiles.

**Estructura de secciones:**
1. Encabezado oscuro con etiqueta "Casos de uso reales"
2. Animación narrativa de 4 historias (iframe, bundle autónomo: anciano, accidente, niño, perro Toby)
3. Tres tarjetas de historia con barra de progreso emocional (situación de caos → escaneo del QR → resolución)
4. Frase de impacto y CTA

**Lógica JS:** Solo `actualizarNavbar()`.

---

### `registro.html` — Crear cuenta y obtener QR

**Propósito:** Formulario de registro en 3 secciones. Al completarlo, el usuario obtiene su código QR listo para imprimir.

**Estructura de secciones:**
1. Indicador de progreso visual (1 · 2 · 3) que se actualiza con el scroll
2. Sección 1 — Datos personales: nombre, apellido, teléfono, fecha de nacimiento, dirección, correo, contraseña
3. Sección 2 — Perfil médico: tipo de sangre, alergias, enfermedades crónicas, medicamentos actuales
4. Sección 3 — Contactos de emergencia: hasta 3 contactos con nombre, parentesco y teléfono
5. Aviso de privacidad con checkbox obligatorio
6. Pantalla de éxito: QR visible + botones de acción (imprimir, copiar URL, ir al panel)

**Lógica JS (`registro.js`):**

```
Al cargar la página:
  → agregarContacto(true)        Crea el bloque del primer contacto (obligatorio)
  → iniciarIndicador()           Activa IntersectionObserver sobre las 3 secciones

Al agregar contacto:
  → agregarContacto(false)       Añade bloques opcionales (máximo 3 en total)

Al hacer submit:
  → validarFormulario()
      → Verifica nombre, apellido, teléfono, correo, contraseña, tipo de sangre,
        contacto 1 completo, y checkbox de privacidad
      → Si inválido: muestra mensajes de error inline y hace scroll al primero
      → Si válido:
          → generarToken()       crypto.randomUUID() → UUID irrepetible
          → guardarPerfil()      localStorage: safetag_perfil_UUID = objeto completo
          → guardarUsuarios()    localStorage: safetag_usuarios = lista de cuentas
          → iniciarSesion()      localStorage: safetag_sesion = token activo
          → mostrarPantallaExito()
              → Construye URL del perfil con window.location.href.replace()
              → new QRCode()     Genera el QR apuntando a perfil.html?id=UUID
              → actualizarNavbar() Cambia los enlaces del menú a "Mi panel / Cerrar sesión"
```

**Efecto JS activo — Indicador de pasos:** `IntersectionObserver` observa los tres bloques del formulario con `threshold: 0.25`. Cuando un bloque entra a la vista, el indicador superior resalta el paso correspondiente (con `clase activo`) y rellena los separadores previos (con `clase completo`).

---

### `perfil.html` — Vista pública de emergencia

**Propósito:** Página que ve quien escanea el QR en una emergencia. No requiere cuenta, login ni conexión especial.

**Estructura de secciones:**
1. Header mínimo con logo y badge rojo "🚨 Emergencia" (sin navbar completo — quien llega viene del QR)
2. Tarjeta de identidad: círculo rojo con tipo de sangre + nombre completo + edad calculada
3. Sección médica: alergias (destacadas en rojo), enfermedades, medicamentos
4. Tarjetas de contacto con nombre, parentesco, teléfono y botón "📞 Llamar" (enlace `tel:` directo)
5. Dirección (solo si fue registrada)
6. Aviso recordando llamar al 911 y que es un proyecto académico

**Lógica JS (`perfil.js`):**

```
Al cargar la página:
  → URLSearchParams lee el parámetro ?id= de la URL
  → obtenerPerfil(token)          Busca en localStorage: safetag_perfil_TOKEN

  → Si el token no existe o no hay ?id en la URL:
      → mostrarError()             Muestra pantalla "Perfil no encontrado"

  → Si el perfil existe:
      → poblarPerfil()
          → Llena nombre, edad (calcularEdad() a partir de YYYY-MM-DD), tipo de sangre
          → llenarCampo()           Marca como .sin-dato si vacío; .con-alerta (rojo) si hay alergia
          → crearTarjetaContacto()  Construye cada tarjeta con href="tel:número-limpio"
          → agregarTooltips()
              → ⓘ en tipo de sangre: explica compatibilidades de transfusión (clic en móvil)
              → ⓘ en alergias: avisa al rescatista de informar al personal médico
```

**Seguridad:** Todos los datos del usuario pasan por `escapeHTML()` antes de ser insertados en el DOM. Esta función crea un nodo de texto temporal y lee su `innerHTML`, convirtiendo caracteres peligrosos (`<`, `>`, `"`, `&`) en entidades HTML y previniendo XSS.

**Diseño para emergencias:** La página está optimizada para celular. Los botones de llamada son grandes (fáciles de presionar con adrenalina), el tipo de sangre está en rojo y tamaño grande, y hay el mínimo de distracciones posible.

---

### `login.html` / `panel.html` — En desarrollo

Estas dos páginas están planificadas para completar el flujo privado. Toda la infraestructura de autenticación ya existe en `app.js`:

| Función | Propósito |
|---|---|
| `buscarUsuarioPorCorreo(correo)` | Valida credenciales al iniciar sesión |
| `requerirSesion()` | Redirige al login si no hay sesión activa |
| `obtenerPerfilActual()` | Carga los datos del usuario autenticado en el panel |
| `cerrarSesion()` | Limpia `safetag_sesion` y redirige al inicio |

---

## Cómo funciona el token de seguridad

El sistema resuelve el problema de privacidad usando un **UUID** (Identificador Único Universal) como token de acceso al perfil público.

**El problema sin token:** Si la URL fuera `perfil.html?id=1`, `perfil.html?id=2`... cualquier persona podría enumerar todos los perfiles y ver información ajena.

**La solución — UUID generado en el navegador:**

```javascript
const token = crypto.randomUUID();
// Ejemplo: "a3f8c2d1-9b4e-4f2a-8c1d-5e7f9a2b3c4d"
```

El UUID tiene 32 caracteres hexadecimales aleatorios. Hay 2¹²² combinaciones posibles (más que átomos en la Tierra observable). Es imposible de adivinar o enumerar. La URL del perfil queda así:

```
perfil.html?id=a3f8c2d1-9b4e-4f2a-8c1d-5e7f9a2b3c4d
```

Solo quien tenga físicamente el QR puede llegar a esa página. El código QR es la llave.

**Nota técnica:** La URL se construye con `window.location.href.replace()` en lugar de `window.location.origin`, porque en el protocolo `file://` el `origin` devuelve `"null"`, lo que rompería la URL generada.

---

## Almacenamiento de datos

Los datos se guardan en el `localStorage` del navegador, sin enviar nada a un servidor.

```
localStorage
├── safetag_sesion              Token UUID del usuario con sesión activa (string)
├── safetag_usuarios            Lista de cuentas registradas (array JSON)
│     [ { id, correo, nombre, password }, ... ]
└── safetag_perfil_UUID         Perfil completo por cada usuario (objeto JSON)
      {
        token, nombre, apellido, telefono,
        fechaNacimiento, direccion, correo,
        tipoSangre, alergias, enfermedades, medicamentos,
        contactos: [ { nombre, parentesco, telefono }, ... ],
        fechaRegistro
      }
```

Cada perfil vive en su propia clave con el UUID como sufijo, lo que evita colisiones entre usuarios en el mismo dispositivo.

---

## Frameworks y librerías externas

Este proyecto no utiliza frameworks de JavaScript (sin React, Vue, Angular ni Bootstrap). Todo el código de interfaz y lógica es JavaScript vanilla y CSS puro. Las únicas dependencias externas son:

| Librería | Cómo se usa | Requiere instalación |
|---|---|---|
| `qrcode.js` (davidshimjs) | `<script src="https://cdn...">` en `registro.html` | No — CDN |
| Claude Design (Anthropic) | Bundles HTML embebidos vía `<iframe>` | No — archivos locales |

**Por qué CSS puro y no Bootstrap:** El sistema de variables CSS propio (`--color-primario`, `--radio-borde`, etc.) permite un control total del diseño y produce un look único y coherente con la identidad del proyecto, sin sobrecarga de clases genéricas.

---

## Diagramas del sistema

Los diagramas formales del proyecto se encuentran en:

📄 [`docs/Segunda entrega/Proyecto_Pulsera_QR.pdf`](./docs/Segunda%20entrega/Proyecto_Pulsera_QR.pdf)

**Contenido del documento:**
- **Organigrama de navegación** — jerarquía de páginas públicas y privadas, con leyenda de colores (Figura 1)
- **Diagrama de clases UML** — 5 entidades: `Usuario`, `Pulsera`, `PerfilMedico`, `ContactoEmergencia`, `Ubicacion`; con atributos, métodos y relaciones (Figura 2)
- Descripción de cada sección del sitio
- Relaciones entre clases del modelo de dominio

> El documento refleja el modelo conceptual completo del sistema. La implementación actual es un **prototipo frontend** que cubre el flujo principal (registro → QR → perfil de emergencia). Características del diseño conceptual como localización en tiempo real y gestión de múltiples pulseras quedan pendientes para una versión con backend.

---

**Materia:** Desarrollo Web — Módulo 4  
**Universidad:** Dr. Andrés Bello (UNAB)  
**Año:** 2026
