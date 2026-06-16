# Definición del Proyecto — TechStore

**Módulo:** Desarrollo Web (HTML, CSS, JS) — Proyecto en equipo
**Entrega:** Repositorio Git (enlace vía Moodle)

## Integrantes del equipo
- Miguel Daniel Reyes Martínez
- Alejandro de Jesús Linares Marroquín
- Vladimir Natanael Villalobos Vega
- Nathalie Jeannette Sibrián Pérez

## Nombre del proyecto
**TechStore** — Tienda en línea de computadoras y accesorios tecnológicos

## Descripción general
TechStore es una interfaz web para una tienda de tecnología que permite a los visitantes explorar un catálogo de productos (laptops, periféricos, componentes y accesorios), agregarlos a un carrito de compras y registrarse como clientes. El diseño contempla los campos y la estructura de datos necesarios para que, en una siguiente etapa, el sitio se conecte a una base de datos real.

---

## 1. ¿Qué problema resolverá la aplicación?

Una tienda de tecnología necesita un canal digital donde:
- Mostrar su catálogo de productos de forma ordenada y atractiva, sin depender de catálogos físicos o redes sociales.
- Captar y centralizar los datos de sus clientes (registro), como base para futuras compras, promociones o programas de fidelidad.
- Ofrecer una experiencia de compra básica (ver productos, agregar al carrito) que sirva como punto de partida para un futuro sistema de ventas en línea.

## 2. ¿Quiénes serán los usuarios?

- **Cliente / Visitante:** navega el catálogo, consulta el detalle de productos, agrega artículos al carrito y se registra/inicia sesión para guardar sus datos.
- **Administrador (alcance opcional, si el tiempo lo permite):** podría visualizar el listado de clientes registrados como una vista simple de "panel".

## 3. ¿Qué funcionalidades tendrá?

| Sección | Funcionalidad |
|---|---|
| Home | Banner principal, presentación de la tienda, accesos a categorías destacadas |
| Catálogo | Listado de productos en tarjetas (imagen, nombre, categoría, precio, botón "agregar al carrito") |
| Detalle de producto | Vista individual con descripción, precio y especificaciones |
| Carrito de compras | Agregar / quitar productos, ver subtotal y total (manejado con JavaScript y `localStorage`, sin pasarela de pago real) |
| Registro de cliente | Formulario con validaciones en JS (nombre, correo, contraseña, teléfono, dirección) |
| Inicio de sesión | Formulario de login (simulado, validado contra datos guardados localmente) |
| Mi cuenta | Vista de los datos del cliente registrado (simula la lectura desde una base de datos) |
| Contacto / Footer | Información de la tienda, ubicación, redes y datos de contacto |

> Todas las funcionalidades se implementan con HTML, CSS y JavaScript en el cliente. No se requiere backend para esta entrega; sin embargo, el diseño de formularios y datos se plantea pensando en una futura integración con una base de datos.

## 4. ¿Qué datos manejará?

El sitio está diseñado para que la información capturada pueda mapearse directamente a tablas de una base de datos relacional:

**Tabla `Clientes`**
| Campo | Tipo | Descripción |
|---|---|---|
| id_cliente | INT (PK) | Identificador único |
| nombre | VARCHAR | Nombre del cliente |
| apellido | VARCHAR | Apellido del cliente |
| correo | VARCHAR | Correo electrónico (único) |
| password | VARCHAR | Contraseña (hash) |
| telefono | VARCHAR | Número de contacto |
| direccion | VARCHAR | Dirección de envío |
| fecha_registro | DATE | Fecha de creación de la cuenta |

**Tabla `Productos`**
| Campo | Tipo | Descripción |
|---|---|---|
| id_producto | INT (PK) | Identificador único |
| nombre | VARCHAR | Nombre del producto |
| categoria | VARCHAR | Laptops, periféricos, componentes, accesorios |
| precio | DECIMAL | Precio unitario |
| stock | INT | Cantidad disponible |
| descripcion | TEXT | Descripción del producto |
| imagen | VARCHAR | Ruta o URL de la imagen |

**Tabla `Carrito` (opcional, según alcance)**
| Campo | Tipo | Descripción |
|---|---|---|
| id_carrito | INT (PK) | Identificador único |
| id_cliente | INT (FK) | Referencia al cliente |
| id_producto | INT (FK) | Referencia al producto |
| cantidad | INT | Unidades agregadas |
| fecha | DATE | Fecha de agregado |

---

## Alcance para esta entrega (16 horas)
- Maquetación HTML/CSS de las páginas: Home, Catálogo, Detalle de producto, Registro/Login, Mi cuenta, Contacto.
- Catálogo de productos con datos de ejemplo (array en JS, sin necesidad de servidor).
- Carrito de compras funcional con `localStorage`.
- Formularios de registro y login con validaciones básicas en JavaScript y persistencia en `localStorage`.
- Diseño responsivo simple (mobile-first o adaptable con CSS Flexbox/Grid).

## Fuera de alcance (para esta entrega)
- Backend real / conexión a base de datos.
- Pasarela de pago.
- Autenticación segura (hash real, sesiones de servidor).
