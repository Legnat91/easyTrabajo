CREATE DATABASE easyParte;
USE easyParte;

CREATE TABLE empresa(
    id_empresa INT AUTO_INCREMENT PRIMARY KEY,
    nif VARCHAR(9) UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    prefijo VARCHAR(5),
    telefono VARCHAR(20),
    email VARCHAR(100),
    pais VARCHAR(100),
    poblacion VARCHAR(100),
    direccion VARCHAR(150),
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE rol(
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE cliente(
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nif VARCHAR(9) UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    poblacion VARCHAR(100) NOT NULL,
    direccion VARCHAR(150) NOT NULL,
    prefijo VARCHAR(5),
    contacto VARCHAR(20),
    email VARCHAR(100),
    cuota BOOLEAN NOT NULL DEFAULT FALSE,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE departamento(
    id_departamento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    id_empresa INT NOT NULL,
    CONSTRAINT fk_departamento_empresa
        FOREIGN KEY (id_empresa)
        REFERENCES empresa(id_empresa)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

CREATE TABLE empleado(
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    apellido VARCHAR(45) NOT NULL,
    apellido_2 VARCHAR(45) NULL,
    extension_tel VARCHAR(10) NULL,
    prefijo VARCHAR(5) NULL,
    movil VARCHAR(20) NULL,
    nif VARCHAR(9) UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    id_departamento INT,
    id_empresa INT,
    CONSTRAINT fk_empleado_departamento
        FOREIGN KEY (id_departamento)
        REFERENCES departamento(id_departamento),
    CONSTRAINT fk_empleado_empresa
        FOREIGN KEY (id_empresa)
        REFERENCES empresa(id_empresa);
);

CREATE TABLE usuario(
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    id_empresa INT NOT NULL,
    id_empleado INT UNIQUE NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_empresa
        FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa),
    CONSTRAINT fk_usuario_empleado 
        FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado) ON DELETE SET NULL
);

CREATE TABLE usuario_rol (
    id_usuario INT,
    id_rol INT,
    PRIMARY KEY (id_usuario, id_rol),
    CONSTRAINT fk_usuario_rol_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),
    CONSTRAINT fk_usuario_rol_rol
        FOREIGN KEY (id_rol)
        REFERENCES rol(id_rol)
);

CREATE TABLE tarea(
    id_tarea INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(500) NOT NULL,
    fecha_alta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_fin DATETIME NULL,
    importancia ENUM('Baja', 'Normal', 'Alta', 'Urgente') NOT NULL DEFAULT 'Normal',
    estado ENUM('Pendiente', 'En proceso', 'Finalizada', 'Cancelada') NOT NULL DEFAULT 'Pendiente',
    persona_contacto VARCHAR(100),
    telefono_contacto VARCHAR(20),
    id_empleado INT NULL,
    id_cliente INT NULL,
    id_departamento INT NULL,
    id_empresa INT NOT NULL,
    id_usuario_creador INT NOT NULL,
    CONSTRAINT fk_tarea_empleado
        FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado),
    CONSTRAINT fk_tarea_cliente
        FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    CONSTRAINT fk_tarea_departamento
        FOREIGN KEY (id_departamento) REFERENCES departamento(id_departamento),
    CONSTRAINT fk_tarea_empresa
        FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa),
    CONSTRAINT fk_tarea_usuario_creador
        FOREIGN KEY (id_usuario_creador) REFERENCES usuario(id_usuario)
);

CREATE TABLE parte_trabajo(
    id_parte_trabajo INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(500) NOT NULL,
    fecha_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_fin DATETIME NULL,
    estado ENUM('Abierto', 'En curso', 'Cerrado', 'Pausado') NOT NULL DEFAULT 'Abierto',
    id_cliente INT NOT NULL,
    id_tarea INT NULL,
    id_empleado INT NULL,
    horas DECIMAL(5,2) DEFAULT 0,
    material TEXT NULL,
    observaciones TEXT NULL,
    firma_cliente VARCHAR(255) NULL,
    CONSTRAINT fk_parte_trabajo_cliente
        FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    CONSTRAINT fk_parte_trabajo_empleado
        FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado),
    CONSTRAINT fk_parte_trabajo_tarea
        FOREIGN KEY (id_tarea) REFERENCES tarea(id_tarea)
);

INSERT INTO rol (nombre) VALUES 
('Administrador'),
('Técnico'),
('Atención al Cliente');

