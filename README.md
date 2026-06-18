# 🩺 Sistema de Localización y Asistencia mediante Pulseras QR

Plataforma web que permite identificar y localizar personas mediante una pulsera equipada con un código QR único. Al escanear el código, se accede a una página con información relevante para emergencias: datos personales, información médica y contactos de emergencia.

Proyecto desarrollado para el **Módulo 4 — Desarrollo Web**, Universidad Dr. Andrés Bello (UNAB).

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Objetivos](#-objetivos)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Diseño General del Sitio](#-diseño-general-del-sitio)
- [Estructura de Clases del Sistema](#-estructura-de-clases-del-sistema)
- [Funcionamiento del Sistema](#-funcionamiento-del-sistema)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Integrantes del Equipo](#-integrantes-del-equipo)
- [Licencia](#-licencia)

---

## 📖 Descripción General

El proyecto consiste en una plataforma web que permite identificar y localizar personas mediante una pulsera equipada con un código QR único. Al escanear el código, se accede a una página con información relevante para emergencias, como datos personales, información médica y contactos de emergencia.

La plataforma combina un componente **público** —accesible sin autenticación al escanear la pulsera— con un panel **privado**, donde cada usuario administra su información personal, médica y de contacto, así como el estado de sus pulseras.

## 🎯 Objetivos

- Facilitar la identificación de personas.
- Proporcionar información médica relevante en situaciones de emergencia.
- Permitir la comunicación rápida con contactos de emergencia.
- Ofrecer localización en tiempo real cuando esté habilitada por el usuario.

## 🛠 Tecnologías Utilizadas

| Categoría | Tecnología |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js |
| Base de Datos | MongoDB |
| Control de Versiones | Git & GitHub |

## 🗺 Diseño General del Sitio

El sitio organiza la información en tres grandes bloques: el área pública de presentación, el panel privado del usuario registrado y la página pública que se genera al escanear el código QR de la pulsera. Esta separación permite que cualquier persona —incluso sin estar registrada— pueda acceder a la información de emergencia de un portador de pulsera, mientras que la administración de los datos queda protegida detrás de un inicio de sesión.

### Diagrama de Navegación — Organigrama del Sitio

```
                                    ┌──────────┐
                                    │  INICIO  │
                                    └────┬─────┘
              ┌──────────────┬──────────┼───────────────┬──────────────┐
              │              │          │                │              │
      ¿Cómo Funciona?  Registro/Login  Panel de    Página Pública   Contacto
                                        Usuario          QR
                                            │                │
                  ┌─────────────┬──────────┼─────┐    ┌──────┼───────┬─────────┐
                  │             │          │     │    │      │       │         │
              Mi Perfil   Perfil Médico  Contactos │ Datos  Info.  Contactos Ubicación
                               │         Emergencia │Person. Médica Emergencia Actual
                          ┌────┴─────┐
                          │          │
                    Mis Pulseras  Ubicación en
                                  Tiempo Real
                                  (si está habilitada)
```

> El diagrama de navegación detallado (con leyenda de colores y notación completa) y el diagrama de clases UML se encuentran en el documento de diseño: [`docs/Proyecto_Pulsera_QR_Mejorado.docx`](./docs/Proyecto_Pulsera_QR_Mejorado.docx).

| Sección | Descripción |
|---|---|
| **Inicio** | Página principal pública con información general del proyecto y accesos a las demás secciones. |
| **¿Cómo Funciona?** | Explica el funcionamiento del sistema: registro, vinculación de la pulsera y escaneo del código QR. |
| **Registro / Login** | Formulario de creación de cuenta e inicio de sesión para usuarios registrados. |
| **Panel de Usuario** | Área privada donde el usuario administra su perfil, pulseras, datos médicos, contactos y ubicación. |
| **Página Pública QR** | Página generada automáticamente al escanear el código QR; muestra solo la información autorizada por el propietario. |
| **Contacto** | Canal de comunicación con el equipo responsable de la plataforma. |

## 🧩 Estructura de Clases del Sistema

El sistema se modela mediante cinco clases principales que representan las entidades centrales del dominio.

| Clase | Atributos principales | Métodos |
|---|---|---|
| **Usuario** | `idUsuario`, `nombreCompleto`, `direccion`, `telefono`, `correo` | `registrarse()`, `iniciarSesion()` |
| **Pulsera** | `idPulsera`, `codigoQR`, `fechaRegistro`, `estado` | `generarQR()`, `activar()` |
| **PerfilMedico** | `idPerfil`, `tipoSangre`, `alergias`, `enfermedades`, `medicamentos` | `actualizarDatos()` |
| **ContactoEmergencia** | `idContacto`, `nombre`, `parentesco`, `telefono` | `notificar()` |
| **Ubicacion** | `idUbicacion`, `latitud`, `longitud`, `fechaHora` | `registrarPosicion()` |

**Relaciones entre clases:**

- Un `Usuario` (1) puede tener varias `Pulsera` (0..*).
- Un `Usuario` (1) posee un `PerfilMedico` (1).
- Un `Usuario` (1) puede registrar varios `ContactoEmergencia` (0..*).
- Una `Pulsera` (1) puede generar múltiples registros de `Ubicacion` (0..*).

## ⚙️ Funcionamiento del Sistema

1. El usuario registra su información personal en la plataforma.
2. Se asocia una pulsera con código QR a la cuenta del usuario.
3. Al escanear el QR se abre una página web pública.
4. Se muestran los datos autorizados por el propietario.
5. En caso de emergencia, se puede contactar rápidamente a familiares o responsables.
6. Opcionalmente se muestra la ubicación en tiempo real.

## 🚀 Instalación y Ejecución

### Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [MongoDB](https://www.mongodb.com/) (local o en la nube, p. ej. MongoDB Atlas)
- [Git](https://git-scm.com/)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/<usuario>/<repositorio>.git

# 2. Entrar a la carpeta del proyecto
cd <repositorio>

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
# Crear un archivo .env en la raíz del proyecto con, por ejemplo:
# MONGO_URI=mongodb://localhost:27017/pulseras_qr
# PORT=3000

# 5. Ejecutar el servidor
npm start
```

La aplicación quedará disponible en `http://localhost:3000`.

## 📁 Estructura del Proyecto

```
proyecto-pulsera-qr/
├── public/             # Archivos estáticos (HTML, CSS, JS del cliente)
│   ├── css/
│   ├── js/
│   └── index.html
├── src/                 # Código fuente del backend (Node.js)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── docs/                # Documentación del proyecto (diagramas, informe)
│   └── Proyecto_Pulsera_QR_Mejorado.docx
├── .env                 # Variables de entorno (no se sube al repositorio)
├── .gitignore
├── package.json
└── README.md
```

## 👥 Integrantes del Equipo

| Nombre |
|---|
| Alejandro De Jesús Linares Marroquín |
| Miguel Daniel Reyes Martínez |
| Nathalie Jeannette Sibrián Pérez |
| Vladimir Natanael Villalobos Vega |

**Materia:** Desarrollo Web — Módulo 4
**Universidad:** Dr. Andrés Bello (UNAB)

## 📄 Licencia

Este proyecto se desarrolla con fines académicos para la Universidad Dr. Andrés Bello. Su uso, copia o distribución fuera de este contexto debe ser autorizado por los autores.
