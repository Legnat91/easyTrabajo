<?php

require_once __DIR__ . '/../helpers/jwt.php';

class AuthMiddleware {
    
    // Función estática para validar la petición
    public static function checkToken() {
        $headers = apache_request_headers();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : null;

        if (!$authHeader) {
            http_response_code(401);
            echo json_encode(["error" => "Acceso denegado. Faltan credenciales de autorización."]);
            exit; // Detiene la ejecución del script aquí mismo
        }

        // El formato esperado es "Bearer <token>"
        $parts = explode(" ", $authHeader);
        if (count($parts) !== 2 || $parts[0] !== 'Bearer') {
            http_response_code(401);
            echo json_encode(["error" => "Formato de token inválido."]);
            exit;
        }

        $token = $parts[1];
        $decoded = JWT::decode($token);

        if (!$decoded) {
            http_response_code(401);
            echo json_encode(["error" => "Token inválido o expirado."]);
            exit;
        }

        // Si el token es válido, devolvemos los datos del usuario desencriptados
        return $decoded;
    }
}
?>