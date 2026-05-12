# EasyTrabajo / EasyParte

![Angular](https://img.shields.io/badge/Angular-21+-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-Vanilla_OOP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

EasyParte es una aplicación web creada como proyecto final de ciclo de DAW. La idea es centralizar parte del trabajo diario de una pequeña empresa de servicios: clientes, avisos, empleados, usuarios, roles y partes de trabajo.

No está planteada como una aplicación lista para producción, sino como un proyecto académico funcional donde se conectan un frontend Angular, una API PHP y una base de datos MariaDB/MySQL.

## Problema que resuelve

En muchas empresas pequeñas, los avisos de clientes, los técnicos asignados y los partes de trabajo acaban repartidos entre llamadas, mensajes o documentos sueltos. Este proyecto intenta ordenar ese flujo en una única herramienta interna:

- Registrar clientes.
- Crear avisos o tareas de trabajo.
- Asignar avisos a empleados.
- Crear partes de trabajo o albaranes.
- Gestionar usuarios y roles.
- Consultar un resumen general desde el dashboard.

## Para quién está pensada

La aplicación está pensada para una empresa de servicios con personal administrativo y técnicos. El administrador gestiona usuarios, empleados y datos generales. Los técnicos pueden consultar avisos asignados o sin asignar y trabajar con partes.

## Estado actual

El proyecto es funcional en local con XAMPP y Angular. Los módulos principales existen y se comunican con la API real. Aun así, hay partes que se consideran mejorables o pendientes, especialmente validaciones, permisos más finos, configuración mediante entorno y pruebas automatizadas.

Valoración honesta del estado: proyecto correcto para TFC, con base completa y defendible, pero no preparado para despliegue real sin revisar seguridad, configuración y manejo de errores.

## Funcionalidades implementadas

- Login con usuario y contraseña.
- Generación y validación de token JWT.
- Dashboard con datos resumen.
- Gestión de clientes: listado, alta, edición y baja lógica.
- Gestión de avisos: listado, alta, edición, cancelación y asignación.
- Gestión de partes de trabajo/albaranes: listado, alta, edición y cierre.
- Gestión de empleados.
- Gestión de usuarios.
- Gestión de roles desde base de datos.
- Control básico de rutas privadas en Angular.
- Control de acceso de administración en frontend y backend.
- Filtrado por empresa en varias consultas del backend.

## Tecnologías usadas

Frontend:

- Angular moderno con standalone components.
- TypeScript.
- Reactive Forms.
- Angular Router.
- Signals.
- Tailwind CSS.
- Chart.js para gráficos del dashboard.

Backend:

- PHP vanilla orientado a objetos.
- API REST sencilla.
- PDO para acceso a base de datos.
- Middleware propio de autenticación.
- JWT propio con firma HMAC SHA-256.

Base de datos:

- MariaDB / MySQL.
- Script SQL exportado desde phpMyAdmin.
- Relaciones mediante claves foráneas.

## Arquitectura general

El proyecto está dividido en tres partes:

- `frontend/`: aplicación Angular que muestra la interfaz y consume la API.
- `backend/`: API PHP que valida sesiones, aplica parte de la lógica y accede a la base de datos.
- `bbdd/`: script SQL para crear e importar la base de datos.

Flujo básico:

1. El usuario inicia sesión desde Angular.
2. Angular envía email y contraseña al backend.
3. PHP valida las credenciales contra MariaDB.
4. Si son correctas, devuelve un token JWT y los datos del usuario.
5. Angular guarda la sesión en `sessionStorage`.
6. Las peticiones privadas incluyen el token en la cabecera `Authorization`.
7. El backend valida el token antes de acceder a los recursos protegidos.

## Estructura de carpetas

```text
easyTrabajo/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── helpers/
│   ├── middleware/
│   ├── models/
│   ├── public/
│   └── routes/
├── bbdd/
│   └── easyparte.sql
├── frontend/
│   ├── public/
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── package-lock.json
├── README.md
├── backend/README.md
└── frontend/README.md
```

## Requisitos previos

- XAMPP, Laragon o entorno similar con Apache, PHP y MySQL/MariaDB.
- PHP 8.x.
- Node.js y npm.
- Angular CLI, o usar los scripts de `npm`.
- Navegador web moderno.

## Instalación desde cero

1. Copiar o clonar el proyecto dentro de `htdocs`:

```bash
C:/xampp/htdocs/easyTrabajo
```

2. Arrancar Apache y MySQL desde XAMPP.

3. Crear la base de datos en phpMyAdmin.

4. Importar el script:

```text
bbdd/easyparte.sql
```

5. Revisar la configuración de conexión en:

```text
backend/config/database.php
```

Por defecto está preparada para un entorno local con:

- host: `localhost`
- base de datos: `easyParte`
- usuario: `root`
- contraseña vacía
- puerto: `3306`

## Cómo ejecutar el backend

Con XAMPP, el backend queda disponible desde Apache si el proyecto está en `htdocs`:

```text
http://localhost/easyTrabajo/backend/public/api
```

Ejemplos de endpoints:

```text
POST   /api/login
GET    /api/dashboard
GET    /api/clientes
POST   /api/clientes
GET    /api/avisos
POST   /api/avisos
GET    /api/partes
POST   /api/partes
GET    /api/empleados
GET    /api/usuarios
GET    /api/roles
```

## Cómo ejecutar el frontend

Entrar en la carpeta del frontend:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Arrancar Angular:

```bash
npm start
```

Abrir:

```text
http://localhost:4200
```

## Cómo configurar la base de datos

El archivo principal es:

```text
bbdd/easyparte.sql
```

Este script crea las tablas principales y carga datos iniciales de prueba. Incluye roles, una empresa demo, clientes, empleados, usuarios, tareas y partes.

Tablas principales:

- `empresa`
- `cliente`
- `empleado`
- `departamento`
- `usuario`
- `rol`
- `usuario_rol`
- `tarea`
- `parte_trabajo`

## Cómo probar el login

El SQL incluye usuarios de prueba. En el README antiguo del proyecto se indicaba el usuario:

```text
profesor@easyparte.es
```

con contraseña:

```text
1234
```

Si el login falla, conviene comprobar:

- Que Apache y MySQL están arrancados.
- Que la base de datos se llama igual que en `database.php`.
- Que el puerto de MySQL coincide con el configurado.
- Que el usuario existe y está activo en la tabla `usuario`.
- Que el token anterior no se ha quedado guardado en `sessionStorage`.

## Roles existentes

Los roles incluidos en la base de datos son:

- `Administrador`
- `Técnico`
- `Atención al Cliente`

El administrador puede acceder a la pantalla de administración para empleados, usuarios y roles. El técnico tiene una vista más limitada de avisos. Aun así, el control de permisos es básico y se podría ampliar por acción concreta.

## Módulos actuales

- Login.
- Dashboard.
- Clientes.
- Avisos.
- Partes de trabajo / albaranes.
- Administración de empleados.
- Administración de usuarios.
- Roles.

## Seguridad implementada

- Contraseñas almacenadas con `password_hash`.
- Validación de login con `password_verify`.
- Token JWT con expiración.
- Middleware de autenticación en rutas privadas.
- Interceptor Angular para enviar el token.
- Guard de autenticación en frontend.
- Guard de rol para administración.
- Protección backend para recursos de administración.
- Consultas preparadas con PDO.
- Mensajes de error genéricos en errores internos principales.

## Limitaciones actuales

- La configuración de base de datos sigue escrita en `database.php`.
- El JWT usa `JWT_SECRET` si existe, pero mantiene clave local por defecto para XAMPP.
- No hay sistema completo de variables de entorno.
- No hay tests automatizados.
- El control de permisos por rol es básico.
- Algunas validaciones dependen aún de la base de datos.
- CORS está abierto para facilitar desarrollo local.
- La aplicación guarda sesión en `sessionStorage`.
- El proyecto incluye datos demo en el SQL.

## Mejoras futuras

- Crear un archivo `.env` o configuración externa real.
- Mejorar el manejo global de errores.
- Añadir pruebas de backend y frontend.
- Centralizar la URL de la API en environments de Angular.
- Mejorar el control de roles en backend por acción.
- Añadir paginación y filtros desde servidor.
- Mejorar auditoría en base de datos con `created_at`, `updated_at`, `deleted_at`.
- Revisar diseño responsive completo.
- Preparar una guía de despliegue si se quisiera publicar.

## Autor y contexto académico

Proyecto desarrollado por Ángel de la Calle Fernández como Trabajo Final de Ciclo de Desarrollo de Aplicaciones Web.

Este repositorio debe entenderse como un proyecto TFC/DAW: su objetivo principal es demostrar integración entre frontend, backend, base de datos, autenticación y gestión de entidades reales en una aplicación web interna.
