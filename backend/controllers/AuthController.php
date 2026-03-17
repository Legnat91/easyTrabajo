<?php
class AuthController {
    private $conn;
    private $tabla = "usuario";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function login($data) {
        // Comprobamos que nos envíen email y password
        if (empty($data->email) || empty($data->password)) {
            http_response_code(400);
            echo json_encode(["error" => "Email y contraseña son obligatorios."]);
            return;
        }

        // Buscamos al usuario por su email
        $query = "SELECT id_usuario, nombre, email, password_hash, id_empresa, id_empleado 
                  FROM " . $this->tabla . " 
                  WHERE email = :email AND activo = 1 LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $data->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            // Comprobamos la contraseña
            if (password_verify($data->password, $usuario['password_hash'])) {
                http_response_code(200);
                unset($usuario['password_hash']); // Quitamos el password por seguridad
                
                echo json_encode([
                    "mensaje" => "Login correcto",
                    "token" => "token_real_generado_por_php_123456",
                    "usuario" => $usuario
                ]);
            } else {
                http_response_code(401);
                echo json_encode(["error" => "Credenciales incorrectas."]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Credenciales incorrectas."]);
        }
    }
}
?>