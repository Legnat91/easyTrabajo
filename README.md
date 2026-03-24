# EasyParte

![Angular](https://img.shields.io/badge/Angular-21+-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-Vanilla_OOP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**EasyParte** es una aplicación web desarrollada como proyecto de TFC (DAW) orientada a la gestión de información interna en una empresa de servicios. 

El objetivo es centralizar la gestión de usuarios, clientes y avisos, aplicando una arquitectura cliente-servidor con autenticación y control de acceso.

## Stack Tecnológico

### Frontend
* **Framework**: Angular 21+ (Standalone Components).
* **Estilos**: Tailwind CSS (Diseño Mobile-First, UI limpia y moderna).
* **Formularios**: Reactive Forms con validaciones asíncronas.
* **Seguridad**: Guards de enrutamiento (`authGuard`) e interceptor para autenticación.

### Backend
* **Lenguaje**: PHP puro (Vanilla) orientado a objetos.
* **Arquitectura**: API RESTful con patrón Front Controller (`index.php`) y enrutador dinámico.
* **Base de Datos**: MariaDB / MySQL.
* **Seguridad**: PDO para acceso a datos y JWT para autenticación.

## Características Principales

- **Sistema de Autenticación**: Login real conectado a la base de datos.
- **Gestión de Clientes**:
  - Listado dinámico con actualizaciones en tiempo real (Signals).
  - Alta y modificaciones.
  - **Baja Logica**: Los clientes no se borran de la base de datos para mantener la integridad referencial de facturas y albaranes.

- **Gestiónn de avisos**: 
  - Listado dinámico con actualizaciones en tiempo real (Signals).
  - Alta de avisos y modificaciones.
  - Avisos con prioridad y asignación del personal.
  - Cancelación de avisos con posibilidad de reactivar.

- **Gestión de albaranes**:
  - En construcción actualmente solo simula un CRUD

- **Gestion de Usuarios/empleados**:
  - Alta de empleados
  - Alta de usuario con asignación de empleado y roles.
  - Falta hacer inactivo de empleado y usuario.
  - Modificación de usuario/empleado. 

## Arquitectura 

* **frontend (Angular)** consume una API REST
* **backend (PHP)** gestiona la lógica de negocio y el acceso a datos
* **JWT** para la autenticación.
* **MariaDB** para la base de datos 

### Flujo de autenticación

1. El usuario inicia sesión
2. El backend valida credenciales
3. Se genera un token JWT
4. El frontend almacena el token
5. En cada petición, el token se envía en la cabecera `Authorization`
6. El backend valida el token mediante middleware

## Estructura del proyecto

El proyecto se divide en dos partes principales:
* `/frontend`: Aplicación cliente en Angular.
* `/backend`: API REST en PHP que sirve los datos.
* `/base de datos`: MariaDB / MySQL

## Seguridad

Se han aplicado medidas básicas de seguridad:

- Contraseñas hasheadas (`password_hash`)
- Tokens JWT con expiración
- Validación de acceso mediante middleware
- Protección de rutas en frontend

## Instalación y Despliegue Local

Para ejecutar este proyecto en tu máquina local, necesitas tener instalado **Node.js**, **Angular CLI** y un servidor local como **XAMPP**.

### 1. Preparar el Backend (XAMPP)
1. Clona este repositorio dentro de la carpeta `htdocs` de XAMPP. La ruta debería quedar así: `C:/xampp/htdocs/easyTrabajo`.
2. Inicia los servicios de **Apache** y **MySQL** en el panel de control de XAMPP.
3. Crear la base de datos:

  **Opción 1** 
- Abre phpMyAdmin (`http://localhost/phpmyadmin`) y crea una base de datos vacía.
- Importar el archivo `easyParte.sql` esto creará automáticamente, actualmente está sobredimensionado para futuras actualizaciones:
  - Estructura de la base de datos
  - Roles del sistema
  - Empresa de prueba
  - Usuario administrador inicial
  
  **Opción 2**
- Copiar la carpeta `easyparte` de `bbdd`en la ruta `C:\xampp\mysql\data`.
- Esto nos creara una base de datos ejemplo, con un usuario `profesor@easyparte.es`con una contraseña `1234`.

### 2. Preparar el Frontend (Angular)
1. Abre una terminal en la carpeta `/frontend` del proyecto.
2. Instala las dependencias:
```bash
npm install
```
3. Levanta el servidor de desarrollo de Angular:
```bash
  ng serve
```
4. Abre tu navegador y navega a 
```bash
http://localhost:4200.
```
  Estado del Proyecto (Roadmap)
  [x] Arquitectura base y Front Controller (PHP).

  [x] UI/UX y Layouts principales (Angular + Tailwind).

  [x] Módulo de Autenticación.

  [x] Módulo de Clientes (CRUD completo).

  [x] Módulo de Avisos (CRUD completo).

  [ ] Módulo de empleado/usuario(falta modificación y baja).

  [ ] Módulo de Albaranes (Actualmente solo simula).

  [ ] Usar modales para mensajes de confirmación.

  ## Autor

  Desarrollado por Ángel de la Calle Fernández para TFC de ciclo de DAW
