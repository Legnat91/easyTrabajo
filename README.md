# EasyParte - Sistema de Gestión de Avisos y Albaranes

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

EasyParte es una aplicación web (Single Page Application) diseñada para digitalizar y agilizar el flujo de trabajo interno de una empresa técnica o de servicios. Permite gestionar todo el ciclo de vida de una asistencia: desde la recepción del aviso, pasando por la asignación a un técnico, hasta la redacción y cierre del parte de trabajo (albarán).

## Características Principales

* **Tablón de Avisos:** Visualización tipo Kanban de las tareas pendientes, en proceso, finalizadas o canceladas.
* **Gestión de Albaranes:** Creación de partes de trabajo vinculados directamente a los avisos, con autocompletado inteligente de IDs.
* **Cartera de Clientes:** Directorio interactivo de empresas y clientes particulares.
* **Cierre en Cascada:** Al confirmar el cierre de un parte de trabajo, el aviso original se da por finalizado automáticamente.
* **Estado Reactivo:** Uso intensivo de **Angular Signals** para un manejo del estado global ultrarrápido sin recargar la página.

## Stack Tecnológico

Este proyecto está construido íntegramente en el Frontend con las últimas herramientas del ecosistema web:
* **Framework:** Angular 21+ (Standalone Components, Control Flow `@if/@for`).
* **Estilos:** Tailwind CSS.
* **Formularios:** ReactiveForms con validaciones síncronas.
* **Enrutamiento:** Lazy Loading moderno y paso de parámetros por Query (`ActivatedRoute`).

---

## Instalación y Despliegue Local

Para levantar este proyecto en tu propia máquina, sigue estos pasos:

### 1. Requisitos previos
Asegúrate de tener instalado en tu sistema:
* [Node.js](https://nodejs.org/) (versión 18 o superior).
* Angular CLI. Si no lo tienes, instálalo globalmente ejecutando:
 
  npm install -g @angular/cli

### 2. Clonar el repositorio
Abre tu terminal y clona este repositorio en tu equipo:

git clone [https://github.com/Legnat91/easyTrabajo.git](https://github.com/Legnat91/easyTrabajo.git)


### 3. Instalar dependencias
Navega a la carpeta del proyecto e instala todos los paquetes necesarios (incluyendo Tailwind):

cd easy-parte
npm install

### 4. Levantar el servidor de desarrollo
Ejecuta el siguiente comando para compilar la aplicación y levantar el servidor:

ng serve

### 5. Abre la aplicación
Ve a tu navegador web favorito y visita:

http://localhost:4200/

La aplicación se recargará automáticamente si realizas cambios en cualquiera de los archivos fuente.

### Arquitectura del Proyecto

El proyecto sigue una estructura basada en "Features" (características) para mantener el código escalable:

    src/app/
    ├── core/          # Interfaces y Servicios (Manejo del estado con Signals)
    ├── shared/        # Componentes reutilizables (ej. Navbar)
    ├── layouts/       # Estructuras de página (Dashboard)
    └── features/      # Módulos principales de la aplicación
          ├── avisos/   
          ├── albaranes/
          └── clientes/

### Próximos Pasos (Roadmap)
[ ] Conectar el listado dinámico de clientes al formulario de creación de albaranes.

[ ] Desarrollar el sistema de Autenticación (Login) y proteger las rutas con Guards.

[ ] Migrar el "falso backend" (Signals) a llamadas HTTP reales conectadas a una API REST en PHP/MySQL.
