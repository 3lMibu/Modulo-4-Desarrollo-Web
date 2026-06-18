# Definición del Proyecto — Sistema de Localización y Asistencia mediante Pulseras QR

**Módulo:** Desarrollo Web (HTML, CSS, JS) — Proyecto en equipo
**Entrega:** Repositorio Git (enlace vía Moodle)

## Integrantes del equipo
- Miguel Daniel Reyes Martínez
- Alejandro de Jesús Linares Marroquín
- Vladimir Natanael Villalobos Vega
- Nathalie Jeannette Sibrián Pérez

## Nombre del proyecto
**SafeTag QR** — Sistema de Localización y Asistencia mediante Pulseras QR

## Descripción general
SafeTag QR es una plataforma web que permite identificar y asistir a personas en situaciones de emergencia mediante una pulsera equipada con un código QR único. Al escanear el código, cualquier persona puede acceder a información de contacto, datos médicos básicos y ubicación del portador, facilitando una respuesta rápida ante emergencias. La plataforma combina un área pública (accesible al escanear) con un panel privado donde el usuario registrado administra su información.

---

## 1. ¿Qué problema resolverá la aplicación?

Cuando una persona se encuentra en una situación de emergencia (accidente, extravío, crisis médica), los servicios de rescate o ciudadanos que le auxilian frecuentemente no tienen acceso rápido a:
- Datos de identidad del afectado.
- Información médica relevante (tipo de sangre, alergias, medicamentos).
- Contactos de emergencia a quienes notificar.
- Ubicación actual para coordinar asistencia.

SafeTag QR resuelve esto permitiendo que esa información esté disponible de forma inmediata al escanear un código QR impreso en una pulsera o llavero que el usuario porta consigo.

## 2. ¿Quiénes serán los usuarios?

| Tipo de usuario | Descripción |
|---|---|
| **Usuario registrado** | Persona que crea su cuenta, ingresa su información personal, médica y de contacto, y administra sus pulseras QR desde un panel privado. |
| **Escáner / Rescatista** | Cualquier persona (ciudadano, policía, paramédico) que escanea el QR de la pulsera. No necesita cuenta — accede directamente a la página pública del portador. |
| **Administrador** (opcional) | Podría gestionar usuarios registrados desde un panel de control. Fuera del alcance del prototipo. |

## 3. ¿Qué funcionalidades tendrá?

| Sección | Funcionalidad |
|---|---|
| **Inicio** | Página principal pública con presentación del proyecto y accesos a las demás secciones. |
| **¿Cómo Funciona?** | Explica el proceso: registro → vinculación de pulsera → escaneo QR → asistencia. |
| **Registro / Login** | Formulario de creación de cuenta e inicio de sesión con validaciones en JavaScript. |
| **Panel de Usuario** | Área privada para gestionar perfil, datos médicos, contactos de emergencia y pulseras. |
| **Página Pública QR** | Página generada al escanear el QR; muestra solo la información autorizada por el propietario. |
| **Mis Pulseras** | Subsección del panel donde el usuario ve sus pulseras activas y el QR generado. |
| **Perfil Médico** | Subsección para registrar tipo de sangre, alergias, enfermedades y medicamentos. |
| **Contactos de Emergencia** | Subsección para registrar nombre, parentesco y teléfono de contactos. |
| **Contacto** | Canal de comunicación con el equipo responsable de la plataforma. |

> **Alcance del prototipo (16 horas):** Esta entrega es un prototipo funcional en HTML, CSS y JavaScript. Los datos se simulan mediante `localStorage` del navegador. La generación del código QR se implementa con la librería JavaScript `qrcode.js` (100% del lado del cliente). La integración con base de datos real y autenticación segura quedan fuera del alcance del módulo.

## 4. ¿Qué datos manejará?

El diseño de datos está orientado a una futura integración con base de datos. Las entidades principales son:

**Entidad `Usuario`**
| Campo | Tipo | Descripción |
|---|---|---|
| idUsuario | INT (PK) | Identificador único |
| nombreCompleto | VARCHAR | Nombre completo del usuario |
| direccion | VARCHAR | Dirección de residencia |
| telefono | VARCHAR | Número de contacto |
| correo | VARCHAR | Correo electrónico (único) |
| password | VARCHAR | Contraseña (hash) |

**Entidad `Pulsera`**
| Campo | Tipo | Descripción |
|---|---|---|
| idPulsera | INT (PK) | Identificador único |
| codigoQR | VARCHAR | Código único generado para el QR |
| fechaRegistro | DATE | Fecha de vinculación |
| estado | VARCHAR | Activa / Inactiva |
| idUsuario | INT (FK) | Usuario propietario |

**Entidad `PerfilMedico`**
| Campo | Tipo | Descripción |
|---|---|---|
| idPerfil | INT (PK) | Identificador único |
| tipoSangre | VARCHAR | Tipo de sangre del portador |
| alergias | TEXT | Alergias conocidas |
| enfermedades | TEXT | Enfermedades preexistentes |
| medicamentos | TEXT | Medicamentos actuales |
| idUsuario | INT (FK) | Usuario al que pertenece (1:1) |

**Entidad `ContactoEmergencia`**
| Campo | Tipo | Descripción |
|---|---|---|
| idContacto | INT (PK) | Identificador único |
| nombre | VARCHAR | Nombre del contacto |
| parentesco | VARCHAR | Relación con el portador |
| telefono | VARCHAR | Número de teléfono |
| idUsuario | INT (FK) | Usuario al que pertenece |

**Entidad `Ubicacion`**
| Campo | Tipo | Descripción |
|---|---|---|
| idUbicacion | INT (PK) | Identificador único |
| latitud | DOUBLE | Coordenada latitud |
| longitud | DOUBLE | Coordenada longitud |
| fechaHora | DATETIME | Fecha y hora del registro |
| idPulsera | INT (FK) | Pulsera que generó el registro |

---

## Fuera de alcance (para esta entrega)
- Backend real / conexión a base de datos.
- Autenticación segura (hash real, sesiones de servidor).
- Historial de ubicación persistente entre dispositivos.
- Panel de administrador.
