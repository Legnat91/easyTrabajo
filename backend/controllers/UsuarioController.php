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
}