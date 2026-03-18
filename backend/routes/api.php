<?php
$partes_ruta = explode('/', $uri);
$indice_api = array_search('api', $partes_ruta);

if ($indice_api !== false && isset($partes_ruta[$indice_api + 1])) {
    $endpoint = $partes_ruta[$indice_api + 1];

    switch ($endpoint) {
        case 'login':
            // Requerimos el controlador
            require_once __DIR__ . '/../controllers/AuthController.php';

            // Leemos el JSON que nos manda Angular en el "Body" de la petición POST
            $datos = json_decode(file_get_contents("php://input"));

            // Pasamos el control al AuthController
            $auth = new AuthController($conexion);
            $auth->login($datos);
            break;

        case 'clientes':
            require_once __DIR__ . '/../controllers/ClienteController.php';
            $clienteController = new ClienteController($conexion);
            // Comprobamos si nos mandan una ID por la URL 
            $id = isset($partes_ruta[$indice_api + 2]) ? $partes_ruta[$indice_api + 2] : null;

            if ($metodo === 'GET') {
                // Angular quiere leer la lista
                $clienteController->getAll();
            } elseif ($metodo === 'POST') {
                //  Angular quiere guardar un cliente nuevo
                // Leemos el JSON que nos manda Angular en el cuerpo de la petición
                $datos = json_decode(file_get_contents("php://input"));
                $clienteController->create($datos);
            } elseif ($metodo === 'PUT' && $id) {
                // PUT es para actualizar
                $datos = json_decode(file_get_contents("php://input"));
                $clienteController->update($id, $datos);
            } elseif ($metodo === 'DELETE' && $id) {
                // DELETE es para borrar
                $clienteController->delete($id);
            }
            break;

        case 'setup':
            // USUARIO DE PRUEBA QUITAR
            try {
                // Creamos la empresa primero
                $conexion->exec("INSERT INTO empresa (nif, nombre, activo) VALUES ('B12345678', 'Empresa Demo S.L.', 1)");
                $id_empresa = $conexion->lastInsertId();

                // Encriptamos la contraseña "1234"
                $password_segura = password_hash("1234", PASSWORD_BCRYPT);

                // Creamos al usuario
                $sql = "INSERT INTO usuario (nombre, email, password_hash, id_empresa, activo) 
                        VALUES ('Admin Demo', 'admin@easyparte.com', '$password_segura', $id_empresa, 1)";
                $conexion->exec($sql);

                echo json_encode(["mensaje" => "¡Base de datos preparada! Empresa y Usuario (admin@easyparte.com / 1234) creados con éxito."]);
            } catch (Exception $e) {
                echo json_encode(["error" => "Ya habías ejecutado el setup o hubo un error: " . $e->getMessage()]);
            }
            break;

        default:
            http_response_code(404);
            echo json_encode(["error" => "El endpoint '/$endpoint' no existe."]);
            break;
    }
} else {
    http_response_code(404);
    echo json_encode(["error" => "No se ha especificado un endpoint válido en la API."]);
}
