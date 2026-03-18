# 🚀 EasyParte (easyTrabajo)

![Angular](https://img.shields.io/badge/Angular-21+-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-Vanilla_OOP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**EasyParte** es una Aplicación Web (SPA) Full-Stack diseñada para la gestión interna de una empresa de servicios. Permite administrar de forma eficiente la cartera de clientes, los avisos (tareas/tickets) y los partes de trabajo (albaranes).

## 🛠️ Stack Tecnológico

### Frontend
* **Framework**: Angular 21+ (Standalone Components).
* **Rendimiento**: Motor Zoneless Change Detection y Signals (`signal`, `update`, `set`) para una interfaz ultra-reactiva.
* **Estilos**: Tailwind CSS (Diseño Mobile-First, UI limpia y moderna).
* **Formularios**: Reactive Forms con validaciones asíncronas.
* **Seguridad**: Guards de enrutamiento (`authGuard`) y manejo de estado de sesión.

### Backend
* **Lenguaje**: PHP puro (Vanilla) orientado a objetos.
* **Arquitectura**: API RESTful con patrón Front Controller (`index.php`) y enrutador dinámico.
* **Base de Datos**: MariaDB / MySQL estructurada para Multitenant.
* **Seguridad**: Conexiones PDO para evitar inyecciones SQL y encriptación de contraseñas con `bcrypt` (`password_hash`).

## ✨ Características Principales

- 🔐 **Sistema de Autenticación**: Login real conectado a la base de datos con persistencia de sesión segura en el cliente.
- 👥 **Gestión de Clientes (CRUD Avanzado)**:
  - Listado dinámico con actualizaciones en tiempo real (Signals).
  - **Soft Delete**: Los clientes no se borran de la base de datos (`activo = 0`) para mantener la integridad referencial de facturas y albaranes.
  - **Upsert Inteligente**: Si se intenta crear un cliente que fue "borrado" previamente (mismo NIF), el sistema lo detecta, lo resucita y actualiza sus datos automáticamente evitando errores de duplicidad.
- ⚡ **Rendimiento Optimizado**: Uso de *Lazy Loading* para cargar los módulos solo cuando el usuario los necesita.

## 📂 Arquitectura del Proyecto

El proyecto se divide en dos partes principales:
* `/frontend`: Aplicación cliente en Angular.
* `/backend`: API REST en PHP que sirve los datos.

## 🚀 Instalación y Despliegue Local

Para ejecutar este proyecto en tu máquina local, necesitas tener instalado **Node.js**, **Angular CLI** y un servidor local como **XAMPP** (Apache + MySQL/MariaDB).

### 1. Preparar el Backend (XAMPP)
1. Clona este repositorio dentro de la carpeta `htdocs` de XAMPP. La ruta debería quedar así: `C:/xampp/htdocs/easyTrabajo`.
2. Inicia los servicios de **Apache** y **MySQL** en el panel de control de XAMPP.
3. Abre phpMyAdmin (`http://localhost/phpmyadmin`) y crea una base de datos vacía.
4. *(Opcional)*: Ejecuta el endpoint de configuración inicial navegando a `http://localhost/easyTrabajo/backend/public/api/setup` para crear las tablas base y un usuario administrador de prueba.

### 2. Preparar el Frontend (Angular)
1. Abre una terminal en la carpeta `/frontend` del proyecto.
2. Instala las dependencias:
   ```bash
   npm install

3. Levanta el servidor de desarrollo de Angular:
  ng serve

4. Abre tu navegador y navega a http://localhost:4200.
  Estado del Proyecto (Roadmap)
  [x] Arquitectura base y Front Controller (PHP).

  [x] UI/UX y Layouts principales (Angular + Tailwind).

  [x] Módulo de Autenticación.

  [x] Módulo de Clientes (CRUD completo).

  [ ] Módulo de Avisos (Kanban/Listado de tareas).

  [ ] Módulo de Albaranes (Partes de trabajo).
