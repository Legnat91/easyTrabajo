# Frontend

![Angular](https://img.shields.io/badge/Angular-21+-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

El frontend está desarrollado con Angular, utilizando una arquitectura basada en componentes, servicios y rutas. Se encarga de la interfaz de usuario y de la comunicación con el backend.

## Estructura

* **app/**

  * **core/** → Servicios y lógica compartida (auth, clientes, avisos, etc.)

  * **features/** → Módulos funcionales (clientes, avisos, empleados, etc.)

  * **layouts/** → Layout principal (dashboard)

  * **shared/** → Componentes reutilizables (navbar, etc.)

## Funcionalidades principales

* Login de usuarios

* Gestión de clientes

* Gestión de avisos

* Gestión de empleados

* Gestión de albaranes

* Navegación mediante rutas protegidas (AuthGuard)

## Comunicación con el backend

Los servicios ubicados en core/services/ se encargan de realizar las peticiones HTTP a la API.

Ejemplo:

  * auth.service.ts

  * clientes.service.ts

  * avisos.service.ts

## Control de acceso

Se utiliza un AuthGuard para proteger las rutas privadas, evitando el acceso sin autenticación.

## Instalación y ejecución

* Instalar dependencias:

    npm install

* Ejecutar la aplicación:

    ng serve

* Acceder en el navegador:

    http://localhost:4200
