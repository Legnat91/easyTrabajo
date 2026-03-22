<?php

require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../models/Usuario.php';

class AuthController {
    private $usuarioModel;

    public function __construct($db) {
        $this->usuarioModel = new Usuario($db);
    }

    public function login($data) {
        if (empty($data->email) || empty($data->password)) {
            http_response_code(400);
            echo json_encode(["error" => "Email y contraseña son obligatorios."]);
            return;
        }

        $usuario = $this->usuarioModel->getByEmailActivo($data->email);

        if (!$usuario) {
            http_response_code(401);
            echo json_encode(["error" => "Credenciales incorrectas."]);
            return;
        }

        if (!password_verify($data->password, $usuario['password_hash'])) {
            http_response_code(401);
            echo json_encode(["error" => "Credenciales incorrectas."]);
            return;
        }

        $payload = [
            "id_usuario" => $usuario['id_usuario'],
            "id_empleado" => $usuario['id_empleado'],
            "id_empresa" => $usuario['id_empresa'],
            "rol_nombre" => $usuario['rol_nombre'],
            "iat" => time(),
            "exp" => time() + (60 * 60 * 8)
        ];

        $jwt_token = JWT::encode($payload);

        unset($usuario['password_hash']);

        http_response_code(200);
        echo json_encode([
            "mensaje" => "Login correcto",
            "token" => $jwt_token,
            "usuario" => $usuario
        ]);
    }
}