-- SafeTag QR — Esquema de base de datos
-- Módulo 5 | UNAB | Julio 2026

CREATE TABLE usuarios (
    id             SERIAL PRIMARY KEY,
    correo         VARCHAR(150) UNIQUE NOT NULL,
    password_hash  VARCHAR(200) NOT NULL,
    nombre         VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pulseras (
    id             SERIAL PRIMARY KEY,
    token          UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    estado         VARCHAR(20) DEFAULT 'activa',
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    usuario_id     INTEGER NOT NULL REFERENCES usuarios(id)
);

CREATE TABLE perfiles (
    id               SERIAL PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL,
    apellido         VARCHAR(100),
    fecha_nacimiento DATE,
    tipo_portador    VARCHAR(20) DEFAULT 'persona',
    tipo_sangre      VARCHAR(15),
    alergias         TEXT,
    enfermedades     TEXT,
    medicamentos     TEXT,
    direccion        TEXT,
    pulsera_id       INTEGER NOT NULL UNIQUE REFERENCES pulseras(id)
);

CREATE TABLE contactos_emergencia (
    id         SERIAL PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    parentesco VARCHAR(50),
    telefono   VARCHAR(30) NOT NULL,
    pulsera_id INTEGER NOT NULL REFERENCES pulseras(id)
);
