<?php

require_once __DIR__ . '/../models/Usuario.php';

class UsuarioController {
    private $conn;
    private $usuarioModel;

    public function __construct($db) {
        $this->conn = $db;
        $this->usuarioModel = new Usuario($db);
    }

    public function create($data, $usuarioLogueado) {
        if (empty($data->email) || empty($data->password) || empty($data->nombre)) {
            http_response_code(400);
            echo json_encode(["error" => "Datos incompletos para crear el usuario."]);
            return;
        }

        try {
            $this->conn->beginTransaction();

            $this->usuarioModel->create($data, $usuarioLogueado->id_empresa);

            $this->conn->commit();

            http_response_code(201);
            echo json_encode(["mensaje" => "Usuario creado correctamente."]);
        } catch (Exception $e) {
            $this->conn->rollBack();
            http_response_code(500);
            echo json_encode(["error" => "Error en la creación: " . $e->getMessage()]);
        }
    }

    public function getAll($usuarioLogueado) {
        $usuarios = $this->usuarioModel->getAllByEmpresa($usuarioLogueado->id_empresa);
        http_response_code(200);
        echo json_encode($usuarios);
    }

   // ACTUALIZAR USUARIO
    public function update($id, $datos, $usuarioLogueado) {
        try {
   
            $this->conn->beginTransaction();

            // ACTUALIZAR TABLA usuario
            if (!empty($datos->password)) {
                $queryUsuario = "UPDATE usuario 
                                 SET nombre = :nombre, email = :email, password_hash = :password, id_empleado = :id_empleado 
                                 WHERE id_usuario = :id AND id_empresa = :id_empresa";
                $stmt = $this->conn->prepare($queryUsuario);
                $stmt->execute([
                    'nombre' => $datos->nombre,
                    'email' => $datos->email,
                    'password' => password_hash($datos->password, PASSWORD_BCRYPT),
                    'id_empleado' => $datos->id_empleado ?? null,
                    'id' => $id,
                    'id_empresa' => $usuarioLogueado->id_empresa
                ]);
            } else {
                $queryUsuario = "UPDATE usuario 
                                 SET nombre = :nombre, email = :email, id_empleado = :id_empleado 
                                 WHERE id_usuario = :id AND id_empresa = :id_empresa";
                $stmt = $this->conn->prepare($queryUsuario);
                $stmt->execute([
                    'nombre' => $datos->nombre,
                    'email' => $datos->email,
                    'id_empleado' => $datos->id_empleado ?? null,
                    'id' => $id,
                    'id_empresa' => $usuarioLogueado->id_empresa
                ]);
            }

            // ACTUALIZAR TABLA usuario_rol
            //
            $stmtCheck = $this->conn->prepare("SELECT id_usuario FROM usuario_rol WHERE id_usuario = :id");
            $stmtCheck->execute(['id' => $id]);
            
            if ($stmtCheck->rowCount() > 0) {
                
                $queryRol = "UPDATE usuario_rol SET id_rol = :id_rol WHERE id_usuario = :id";
                $stmtRol = $this->conn->prepare($queryRol);
                $stmtRol->execute(['id_rol' => $datos->id_rol, 'id' => $id]);
            } else {
              
                $queryRol = "INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (:id, :id_rol)";
                $stmtRol = $this->conn->prepare($queryRol);
                $stmtRol->execute(['id' => $id, 'id_rol' => $datos->id_rol]);
            }

            
            $this->conn->commit();

            http_response_code(200);
            echo json_encode(["mensaje" => "Usuario actualizado correctamente"]);

        } catch (Exception $e) {
      
            $this->conn->rollBack();
            http_response_code(500);
            echo json_encode(["error" => "Error al actualizar usuario: " . $e->getMessage()]);
        }
    }

  
    public function delete($id, $usuarioLogueado) {
        try {
            // Desactivamos el usuario para que no pueda hacer login
            $query = "UPDATE usuario SET activo = 0 WHERE id_usuario = :id AND id_empresa = :id_empresa";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                'id' => $id,
                'id_empresa' => $usuarioLogueado->id_empresa
            ]);
            
            http_response_code(200);
            echo json_encode(["mensaje" => "Usuario eliminado correctamente"]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al eliminar usuario: " . $e->getMessage()]);
        }
    }
}