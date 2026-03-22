<?php
require_once __DIR__ . '/../models/Cliente.php';
require_once __DIR__ . '/../helpers/response.php';


class ClienteController
{
    private $clienteModel;

    public function __construct($db)
    {
        $this->clienteModel = new Cliente($db);
    }

    public function getAll($usuarioLogueado)
    {
        $clientes = $this->clienteModel->getAllByEmpresa($usuarioLogueado->id_empresa);

        Response::json($clientes ?: [],200);
    }

    public function create($data, $usuarioLogueado)
    {
        if (empty($data->nombre) || empty($data->nif)) {
             
            Response::error("Nombre y NIF son obligatorios.", 400);
        }

        $cliente = $this->clienteModel->create($data, $usuarioLogueado->id_empresa);

        if ($cliente) {
            http_response_code(201);
            echo json_encode([
                "mensaje" => "Cliente creado",
                "cliente" => $cliente
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error de base de datos"]);
        }
    }

    public function update($id, $data, $usuarioLogueado)
    {
        $ok = $this->clienteModel->update($id, $data, $usuarioLogueado->id_empresa);

        if ($ok) {
            http_response_code(200);
            echo json_encode(["mensaje" => "Cliente actualizado"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Error al actualizar."]);
        }
    }

    public function delete($id, $usuarioLogueado)
    {
        $ok = $this->clienteModel->softDelete($id, $usuarioLogueado->id_empresa);

        if ($ok) {
            http_response_code(200);
            echo json_encode(["mensaje" => "Cliente desactivado correctamente"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "No se pudo eliminar el cliente."]);
        }
    }
}