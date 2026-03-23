# Backend

![PHP](https://img.shields.io/badge/PHP-Vanilla_OOP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)


El backend de easyTrabajo está desarrollado en PHP siguiendo una estructura modular basada en controladores, modelos y rutas. Se encarga de la gestión de la lógica de negocio, autenticación y acceso a datos.

## Estructura

* **controllers/** → Controladores de cada entidad (clientes, avisos, empleados, etc.)

* **models/** → Modelos que representan las entidades de la base de datos

* **routes/** → Definición de endpoints de la API

* **middleware/** → Middleware de autenticación

* **helpers/** → Funciones auxiliares (JWT, respuestas, etc.)

* **config/** → Configuración (base de datos, CORS, etc.)

* **public/** → Punto de entrada (index.php)

## Funcionalidades principales

* Autenticación mediante JWT

* Gestión de usuarios y empleados

* Gestión de clientes

* Gestión de avisos

* Gestión de albaranes

* API REST para comunicación con el frontend

## Autenticación

El sistema utiliza JSON Web Tokens (JWT) para proteger las rutas privadas.
Las peticiones autenticadas deben incluir el token en la cabecera:
```bash
Authorization: Bearer <token>
```
## Base de datos

La configuración de la base de datos se encuentra en:
```bash
config/database.php
```
Asegúrate de configurar correctamente:

* Host

* Nombre de la base de datos

* Usuario

* Contraseña

## Ejecución

El backend puede ejecutarse en un servidor Apache o similar apuntando a:
```bash
backend/public/
```
También puedes usar un servidor local tipo XAMPP, Laragon o similar.