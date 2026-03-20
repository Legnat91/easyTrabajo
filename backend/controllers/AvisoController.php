<?php
class AvisoController
{
    private $conn;
    private $tabla = "tarea";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    //CARGAR AVIOS
    public function getAll()
    {
        $query = "SELECT * FROM " . $this->tabla . " ORDER BY fecha_alta DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $avisos_arr = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($avisos_arr, $row);
            }
            http_response_code(200);
            echo json_encode($avisos_arr);
        } else {
            http_response_code(200);
            echo json_encode([]);
        }
    }

    //CREAR AVISO
    public function create($data)
    {
        if (empty($data->descripcion) || empty($data->id_cliente)) {
            http_response_code(400);
            echo json_encode(["error" => "La descripción y el cliente son obligatorios."]);
            return;
        }

        $query = "INSERT INTO " . $this->tabla . " 
                  (descripcion, importancia, estado, persona_contacto, telefono_contacto, id_empleado, id_cliente, id_empresa, id_usuario_creador, fecha_alta) 
                  VALUES (:descripcion, :importancia, :estado, :persona_contacto, :telefono_contacto, :id_empleado, :id_cliente, :id_empresa, :id_usuario_creador, NOW())";

        $stmt = $this->conn->prepare($query);

        $importancia = !empty($data->importancia) ? $data->importancia : 'Normal';
        $estado = !empty($data->estado) ? $data->estado : 'Pendiente';
        $persona_contacto = !empty($data->persona_contacto) ? $data->persona_contacto : null;
        $telefono_contacto = !empty($data->telefono_contacto) ? $data->telefono_contacto : null;
        $id_empleado = !empty($data->id_empleado) ? $data->id_empleado : null;
        $id_empresa = !empty($data->id_empresa) ? $data->id_empresa : 1;

     
        $id_usuario_creador = 1;

        $stmt->bindParam(":descripcion", $data->descripcion);
        $stmt->bindParam(":importancia", $importancia);
        $stmt->bindParam(":estado", $estado);
        $stmt->bindParam(":persona_contacto", $persona_contacto);
        $stmt->bindParam(":telefono_contacto", $telefono_contacto);
        $stmt->bindParam(":id_empleado", $id_empleado);
        $stmt->bindParam(":id_cliente", $data->id_cliente);
        $stmt->bindParam(":id_empresa", $id_empresa);
        $stmt->bindParam(":id_usuario_creador", $id_usuario_creador); // Vinculamos el dato

        try {
            if ($stmt->execute()) {
                $id_insertado = $this->conn->lastInsertId();

                $query_get = "SELECT * FROM " . $this->tabla . " WHERE id_tarea = :id";
                $stmt_get = $this->conn->prepare($query_get);
                $stmt_get->bindParam(":id", $id_insertado);
                $stmt_get->execute();

                http_response_code(201);
                echo json_encode([
                    "mensaje" => "Aviso creado con éxito",
                    "aviso" => $stmt_get->fetch(PDO::FETCH_ASSOC)
                ]);
            }
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(["error" => "Error al guardar el aviso: " . $e->getMessage()]);
        }
    }

    //ACTUALIZAR AVISOS
    public function update($id, $data)
    {
        //Datos actuales
        $query_get = "SELECT * FROM " . $this->tabla . " WHERE id_tarea= :id";
        $stmt_get = $this->conn->prepare($query_get);
        $stmt_get->bindParam(":id", $id);
        $stmt_get->execute();

        if ($stmt_get->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(["error" => "Aviso no encontrado."]);
            return;
        }

        $actual = $stmt_get->fetch(PDO::FETCH_ASSOC);

        // Combinar los datos actuales con los nuevos (si existen)
        $descripcion = isset($data->descripcion) ? $data->descripcion : $actual['descripcion'];
        $importancia = isset($data->importancia) ? $data->importancia : $actual['importancia'];
        $estado = isset($data->estado) ? $data->estado : $actual['estado'];
        $persona_contacto = property_exists($data, 'persona_contacto') ? $data->persona_contacto : $actual['persona_contacto'];
        $telefono_contacto = property_exists($data, 'telefono_contacto') ? $data->telefono_contacto : $actual['telefono_contacto'];
        $id_empleado = property_exists($data, 'id_empleado') ? $data->id_empleado : $actual['id_empleado'];
        $id_cliente = isset($data->id_cliente) ? $data->id_cliente : $actual['id_cliente'];

        // Controlar la fecha de finalización si cambia el estado
        $fecha_fin = $actual['fecha_fin'];
        if (($estado === 'Finalizada' || $estado === 'Cancelada') && empty($fecha_fin)) {
            $fecha_fin = date('Y-m-d H:i:s');
        } elseif ($estado !== 'Finalizada' && $estado !== 'Cancelada') {
            $fecha_fin = null;
        }
        $query = "UPDATE " . $this->tabla . " 
                  SET descripcion=:descripcion, importancia=:importancia, estado=:estado, 
                      persona_contacto=:persona_contacto, telefono_contacto=:telefono_contacto, 
                      id_empleado=:id_empleado, id_cliente=:id_cliente, fecha_fin=:fecha_fin 
                  WHERE id_tarea = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":descripcion", $descripcion);
        $stmt->bindParam(":importancia", $importancia);
        $stmt->bindParam(":estado", $estado);
        $stmt->bindParam(":persona_contacto", $persona_contacto);
        $stmt->bindParam(":telefono_contacto", $telefono_contacto);
        $stmt->bindParam(":id_empleado", $id_empleado);
        $stmt->bindParam(":id_cliente", $id_cliente);
        $stmt->bindParam(":fecha_fin", $fecha_fin);
        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["mensaje" => "Aviso actualizado"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "No se pudo actualizar el aviso."]);
        }
    }
    // ELIMINAR UN AVISO
    public function delete($id)
    {
        $query = "DELETE FROM " . $this->tabla . " WHERE id_tarea = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["mensaje" => "Aviso eliminado"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "No se pudo eliminar el aviso."]);
        }
    }
}
