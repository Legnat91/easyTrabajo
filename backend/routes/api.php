<?php
// Requerimos el middleware de autenticación
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

$partes_ruta = explode('/', $uri);
$indice_api = array_search('api', $partes_ruta);

if ($indice_api !== false && isset($partes_ruta[$indice_api + 1])) {
    $endpoint = $partes_ruta[$indice_api + 1];

    switch ($endpoint) {
        case 'login':
            require_once __DIR__ . '/../controllers/AuthController.php';
            $datos = json_decode(file_get_contents("php://input"));
            $auth = new AuthController($conexion);
            $auth->login($datos);
            break;

        case 'clientes':
            $usuarioLogueado = AuthMiddleware::checkToken();
            
            require_once __DIR__ . '/../controllers/ClienteController.php';
            $clienteController = new ClienteController($conexion);
            $id = isset($partes_ruta[$indice_api + 2]) ? $partes_ruta[$indice_api + 2] : null;

            if ($metodo === 'GET') {
                $clienteController->getAll($usuarioLogueado);
            } elseif ($metodo === 'POST') {
                $datos = json_decode(file_get_contents("php://input"));
                $clienteController->create($datos, $usuarioLogueado);
            } elseif ($metodo === 'PUT' && $id) {
                $datos = json_decode(file_get_contents("php://input"));
                $clienteController->update($id, $datos, $usuarioLogueado);
            } elseif ($metodo === 'DELETE' && $id) {
                $clienteController->delete($id, $usuarioLogueado);
            }
            break;

        case 'avisos':
            $usuarioLogueado = AuthMiddleware::checkToken();

            require_once __DIR__ . '/../controllers/AvisoController.php';
            $avisoController = new AvisoController($conexion);
            $id = isset($partes_ruta[$indice_api + 2]) ? $partes_ruta[$indice_api + 2] : null;

            if ($metodo === 'GET') {
                
                $avisoController->getAll($usuarioLogueado);
            } elseif ($metodo === 'POST') {
                $datos = json_decode(file_get_contents("php://input"));
                $avisoController->create($datos, $usuarioLogueado);
            } elseif ($metodo === 'PUT' && $id) {
                $datos = json_decode(file_get_contents("php://input"));
                $avisoController->update($id, $datos, $usuarioLogueado);
            } elseif ($metodo === 'DELETE' && $id) {
                $avisoController->delete($id, $usuarioLogueado);
            }
            break;

        case 'empleados':
        case 'usuarios':
        case 'roles':
            $usuarioLogueado = AuthMiddleware::checkToken();
            
            if ($usuarioLogueado->rol_nombre !== 'Administrador') {
                http_response_code(403);
                echo json_encode(["error" => "No tienes permisos de administrador para este recurso."]);
                exit;
            }

            if ($endpoint === 'empleados') {
                require_once __DIR__ . '/../controllers/EmpleadoController.php';
                $controller = new EmpleadoController($conexion);
                if ($metodo === 'GET') $controller->getAll($usuarioLogueado);
                elseif ($metodo === 'POST') {
                    $datos = json_decode(file_get_contents("php://input"));
                    $controller->create($datos, $usuarioLogueado);
                }
            } elseif ($endpoint === 'usuarios') {
                require_once __DIR__ . '/../controllers/UsuarioController.php';
                $controller = new UsuarioController($conexion);
                if ($metodo === 'GET') $controller->getAll($usuarioLogueado);
                elseif ($metodo === 'POST') {
                    $datos = json_decode(file_get_contents("php://input"));
                    $controller->create($datos, $usuarioLogueado);
                }
            } elseif ($endpoint === 'roles') {
                require_once __DIR__ . '/../controllers/RolController.php';
                $controller = new RolController($conexion);
                if ($metodo === 'GET') $controller->getAll();
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