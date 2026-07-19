# SafeTag QR — Sistema de Asistencia en Emergencias

Plataforma web que permite registrar información personal, médica y contactos de emergencia, y obtener un código QR único para llevar en una pulsera, llavero o collar de mascota. Al escanear el código en una emergencia, cualquier persona accede a esa información desde su celular, sin necesidad de tener una cuenta.

Proyecto desarrollado para **Módulo 4 y Módulo 5 — Desarrollo Web**, Universidad Dr. Andrés Bello (UNAB), 2026.

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

1. [Estado del proyecto por módulo](#estado-del-proyecto-por-módulo)
2. [Tecnologías utilizadas](#tecnologías-utilizadas)
3. [Cómo levantar el proyecto](#cómo-levantar-el-proyecto)
4. [Estructura de archivos](#estructura-de-archivos)
5. [API — Endpoints disponibles](#api--endpoints-disponibles)
6. [Paleta de colores](#paleta-de-colores)
7. [Vistas del sitio](#vistas-del-sitio)
8. [Cómo funciona el token de seguridad](#cómo-funciona-el-token-de-seguridad)
9. [Base de datos](#base-de-datos)
10. [Frameworks y librerías externas](#frameworks-y-librerías-externas)

---

## Estado del proyecto por módulo

| Módulo | Alcance | Estado |
|---|---|---|
| Módulo 4 | Frontend puro — HTML/CSS/JS con `localStorage` | ✅ Entregado |
| Módulo 5 | Backend Node.js + PostgreSQL + interfaz privada | ✅ Entregado |

---

## Tecnologías utilizadas

### Frontend
| Categoría | Tecnología | Uso |
|---|---|---|
| Estructura | HTML5 | Todas las páginas del sitio |
| Estilos | CSS3 con variables personalizadas | Sistema de diseño en `styles.css` |
| Lógica | JavaScript vanilla (ES6+) | Validación, QR, sesión, fetch al API |
| QR | `qrcode.js` vía CDN | Genera el QR en el navegador |
| Animaciones | Claude Design | Bundles HTML/CSS/JS embebidos vía `<iframe>` |

### Backend (Módulo 5)
| Categoría | Tecnología | Uso |
|---|---|---|
| Runtime | Node.js v24 | Servidor |
| Framework | Express.js v5 | Rutas y middleware |
| Base de datos | PostgreSQL 17 | Almacenamiento persistente |
| Autenticación | bcrypt | Hash de contraseñas |
| Variables de entorno | dotenv | Configuración local segura |
| Dev server | nodemon | Reinicio automático en desarrollo |

---

## Cómo levantar el proyecto

### Requisitos previos
- Node.js v18 o superior
- PostgreSQL 15 o superior corriendo en el puerto 5432

### 1. Crear la base de datos

```sql
psql -U postgres
CREATE DATABASE safetag_db;
CREATE USER safetag_user WITH PASSWORD 'safetag2026';
GRANT ALL PRIVILEGES ON DATABASE safetag_db TO safetag_user;
\c safetag_db
GRANT ALL ON SCHEMA public TO safetag_user;
```

Luego aplicar el schema:

```bash
psql -U safetag_user -d safetag_db -f backend/sql/schema.sql
```

### 2. Configurar variables de entorno

Crear el archivo `backend/.env` (no se sube a git):

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=safetag_db
DB_USER=safetag_user
DB_PASSWORD=safetag2026
PORT=3001
```

### 3. Instalar dependencias e iniciar

```bash
cd backend
npm install
dev.cmd          # Windows — equivale a npm run dev
```

### 4. Abrir el sitio

Navegar a `http://localhost:3001` en el navegador.

> **Acceso desde otros dispositivos en la misma red:** usar la IP local de la máquina (ej. `http://192.168.x.x:3001`). Ambos dispositivos deben estar en la misma red WiFi.

---

## Estructura de archivos

```
proyecto/
│
├── index.html                    Página principal — landing page pública
├── como-funciona.html            Explicación del sistema en 4 pasos
├── historias.html                Casos de uso narrativos
├── registro.html                 Formulario de registro — crea cuenta y genera QR
├── perfil.html                   Vista pública de emergencia (al escanear el QR)
├── login.html                    Inicio de sesión → redirige al panel
├── panel.html                    Panel privado — gestión de pulseras
├── animacion-como-funciona.html  Bundle de animación (autónomo)
├── animacion-historias.html      Bundle de animación (autónomo)
│
├── css/
│   └── styles.css                Sistema de diseño completo
│
├── js/
│   ├── app.js                    Funciones compartidas
│   ├── registro.js               Lógica del formulario de registro (llama al API)
│   └── perfil.js                 Lógica de la página pública (llama al API)
│
├── backend/
│   ├── server.js                 Punto de entrada — Express + static files
│   ├── dev.cmd                   Script para levantar el servidor en Windows
│   ├── .env                      Variables de entorno (no en git)
│   ├── package.json
│   └── src/
│       ├── config/
│       │   └── db.js             Pool de conexión PostgreSQL
│       ├── controllers/
│       │   └── perfiles.controller.js   Lógica de negocio de todos los endpoints
│       └── routes/
│           └── api.routes.js     Definición de rutas del API
│
└── docs/
    ├── Primera entrega/
    └── Segunda entrega/
```

---

## API — Endpoints disponibles

Base URL: `http://localhost:3001/api`

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `GET` | `/publico/:token` | Devuelve perfil + contactos de una pulsera (para quien escanea el QR) | No |
| `POST` | `/registro` | Crea usuario + pulsera + perfil + contactos en una transacción ACID | No |
| `POST` | `/login` | Verifica credenciales con bcrypt, devuelve datos del usuario | No |
| `GET` | `/mis-pulseras` | Lista todas las pulseras del usuario con su perfil | `?usuario_id=` |
| `POST` | `/pulseras` | Agrega una nueva pulsera a un usuario existente | `usuario_id` en body |
| `GET` | `/server-url` | Devuelve la URL de red del servidor (para construir QRs accesibles) | No |

### Ejemplo — POST /api/registro

```json
{
  "correo": "usuario@email.com",
  "password": "mipassword",
  "nombre": "Sandra Martinez",
  "perfil": {
    "nombre": "Sandra",
    "apellido": "Martinez",
    "fecha_nacimiento": "1994-03-15",
    "tipo_portador": "persona",
    "tipo_sangre": "A+",
    "alergias": "Penicilina",
    "enfermedades": "Diabetes tipo 2",
    "medicamentos": "Metformina",
    "direccion": "Col. Centro"
  },
  "contactos": [
    { "nombre": "Amalia Martinez", "parentesco": "Hermana", "telefono": "77554433" }
  ]
}
```

---

## Paleta de colores

| Variable | Color | Uso principal |
|---|---|---|
| `--color-primario` | `#1F4E78` — Azul oscuro | Navbar, títulos, encabezados |
| `--color-secundario` | `#2E75B6` — Azul medio | Gradientes |
| `--color-acento` | `#00A896` — Verde azulado | Éxito, botón Llamar, badges |
| `--color-alerta` | `#F4A261` — Ámbar | Botones CTA |
| `--color-peligro` | `#E63946` — Rojo | Errores, alergias, círculo de sangre |
| `--color-fondo` | `#F8F9FA` | Fondo general |
| `--color-superficie` | `#FFFFFF` | Tarjetas, formularios |
| `--color-texto` | `#212529` | Texto principal |
| `--color-texto-suave` | `#6C757D` | Texto secundario |
| `--color-borde` | `#DEE2E6` | Bordes de inputs |

---

## Vistas del sitio

### Páginas públicas (sin sesión)
- **`index.html`** — Landing page con animación, características y CTA
- **`como-funciona.html`** — Proceso en 4 pasos con animación
- **`historias.html`** — Casos de uso narrativos
- **`perfil.html?token=UUID`** — Vista de emergencia al escanear el QR; consulta `GET /api/publico/:token`

### Páginas privadas (requieren sesión)
- **`registro.html`** — Formulario en 3 secciones; llama `POST /api/registro`; guarda sesión en `sessionStorage` y redirige al panel
- **`login.html`** — Llama `POST /api/login`; guarda `{ id, nombre, correo }` en `sessionStorage`
- **`panel.html`** — Lista pulseras del usuario con QR; permite agregar nuevas pulseras vía modal; llama `GET /api/mis-pulseras` y `POST /api/pulseras`

### Tipos de portador soportados
`persona` · `niño` · `adulto mayor` · `mascota` · `objeto`

---

## Cómo funciona el token de seguridad

Cada pulsera tiene un UUID generado por PostgreSQL (`gen_random_uuid()`). La URL del perfil público es:

```
http://[ip]:3001/perfil.html?token=a3f8c2d1-9b4e-4f2a-8c1d-5e7f9a2b3c4d
```

Con 2¹²² combinaciones posibles es imposible de adivinar o enumerar. Solo quien tenga físicamente el QR puede acceder al perfil. El QR es la llave.

---

## Base de datos

### Schema (PostgreSQL)

```sql
usuarios (id, correo UNIQUE, password_hash, nombre, fecha_registro)
    │
    └── pulseras (id, token UUID UNIQUE, estado, fecha_creacion, usuario_id FK)
            │
            ├── perfiles (id, nombre, apellido, fecha_nacimiento, tipo_portador,
            │             tipo_sangre, alergias, enfermedades, medicamentos,
            │             direccion, pulsera_id FK UNIQUE)
            │
            └── contactos_emergencia (id, nombre, parentesco, telefono, pulsera_id FK)
```

Un usuario puede tener múltiples pulseras. Cada pulsera tiene exactamente un perfil y hasta 3 contactos de emergencia.

---

## Frameworks y librerías externas

No se usan frameworks de JS (sin React, Vue ni Angular). Todo el frontend es JavaScript vanilla y CSS puro.

| Librería | Dónde | Cómo |
|---|---|---|
| `qrcode.js` (davidshimjs) | Frontend | CDN en `registro.html` y `panel.html` |
| Express.js | Backend | `npm install` |
| pg (node-postgres) | Backend | `npm install` |
| bcrypt | Backend | `npm install` |
| dotenv | Backend | `npm install` |
| nodemon | Backend (dev) | `npm install` |

---

**Materia:** Desarrollo Web — Módulo 4 y Módulo 5
**Universidad:** Dr. Andrés Bello (UNAB)
**Año:** 2026
