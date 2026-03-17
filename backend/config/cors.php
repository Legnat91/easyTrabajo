<?php
// Permitir que cualquier origen  se conecte a nuestra API. 
// Aqui en produccion se pone el dominio
header("Access-Control-Allow-Origin: *");

// Permitir los métodos que Angular va a usar
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Permitir las cabeceras que Angular va a enviar (como el Content-Type o el Authorization para el Token)
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Si Angular manda una petición OPTIONS (lo hace automáticamente antes de un POST/PUT para comprobar permisos),
// le decimos que todo está OK y cortamos la ejecución para no cargar la base de datos en balde.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>