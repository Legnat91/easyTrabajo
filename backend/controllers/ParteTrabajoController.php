<?php

class ParteTrabajoController
{
    private $conn;
    private $tabla = "parte_trabajo";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // OBTENER TODOS LOS PARTES
    public function getAll($usuarioLogueado)
    {
        $query = "SELECT 
                    p.*, 
                    c.nombre as cliente_nombre,
                    CONCAT(e.nombre, ' ', e.apellido) as tecnico_nombre
                  FROM " . $this->tabla . " p
                  LEFT JOIN cliente c ON p.id_cliente = c.id_cliente
                  LEFT JOIN empleado e ON p.id_empleado = e.id_empleado
                  WHERE p.id_empresa = :id_empresa AND p.activo = 1
                  ORDER BY p.fecha_inicio DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_empresa", $usuarioLogueado->id_empresa);
        $stmt->execute();

        http_response_code(200);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // CREAR UN PARTE DE TRABAJO
    public function create($data, $usuarioLogueado)
    {
        if (empty($data->descripcion) || empty($data->id_cliente)) {
            http_response_code(400);
            echo json_encode(["error" => "La descripción y el cliente son obligatorios."]);
            return;
        }

        
        $query = "INSERT INTO " . $this->tabla . " 
                  (id_empresa, descripcion, estado, id_cliente, id_tarea, id_empleado, horas, material, observaciones) 
                  VALUES (:id_empresa, :descripcion, 'En curso', :id_cliente, :id_tarea, :id_empleado, :horas, :material, :observaciones)";

        $stmt = $this->conn->prepare($query);

        $id_tarea = !empty($data->id_tarea) ? $data->id_tarea : null;
        $id_empleado = !empty($data->id_empleado) ? $data->id_empleado : $usuarioLogueado->id_empleado;
        $horas = !empty($data->horas) ? $data->horas : 0;
        $material = !empty($data->material) ? $data->material : null;
        $observaciones = !empty($data->observaciones) ? $data->observaciones : null;

        $stmt->bindParam(":id_empresa", $usuarioLogueado->id_empresa);
        $stmt->bindParam(":descripcion", $data->descripcion);
        $stmt->bindParam(":id_cliente", $data->id_cliente);
        $stmt->bindParam(":id_tarea", $id_tarea);
        $stmt->bindParam(":id_empleado", $id_empleado);
        $stmt->bindParam(":horas", $horas);
        $stmt->bindParam(":material", $material);
        $stmt->bindParam(":observaciones", $observaciones);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["mensaje" => "Parte de trabajo guardado (En curso)", "id" => $this->conn->lastInsertId()]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al guardar el parte."]);
        }
    }

    // ACTUALIZAR EDITAR
    public function update($id, $data, $usuarioLogueado)
    {
        try {
            $this->conn->beginTransaction();

            
            $query = "UPDATE " . $this->tabla . " 
                      SET descripcion=:descripcion, horas=:horas, material=:material, 
                          observaciones=:observaciones, estado=:estado ";
            
            // Si cerramos el parte se pone fecha fin
            if (isset($data->estado) && $data->estado === 'Cerrado') {
                $query .= ", fecha_fin=NOW() ";
            }
            
            $query .= " WHERE id_parte_trabajo = :id AND id_empresa = :id_empresa";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":descripcion", $data->descripcion);
            $stmt->bindParam(":horas", $data->horas);
            $stmt->bindParam(":material", $data->material);
            $stmt->bindParam(":observaciones", $data->observaciones);
            $stmt->bindParam(":estado", $data->estado);
            $stmt->bindParam(":id", $id);
            $stmt->bindParam(":id_empresa", $usuarioLogueado->id_empresa);
            $stmt->execute();

            // Si cerramos el parte y tiene un aviso asociado, damos por teminado el aviso
            if (isset($data->estado) && $data->estado === 'Cerrado' && !empty($data->id_tarea)) {
                $qTarea = "UPDATE tarea SET estado = 'Finalizada', fecha_fin = NOW() WHERE id_tarea = :id_tarea AND id_empresa = :id_empresa";
                $stTarea = $this->conn->prepare($qTarea);
                $stTarea->bindParam(":id_tarea", $data->id_tarea);
                $stTarea->bindParam(":id_empresa", $usuarioLogueado->id_empresa);
                $stTarea->execute();
            }

            $this->conn->commit();
            http_response_code(200);
            echo json_encode(["mensaje" => "Parte actualizado correctamente"]);

        } catch (Exception $e) {
            $this->conn->rollBack();
            http_response_code(500);
            echo json_encode(["error" => "Error al actualizar: " . $e->getMessage()]);
        }
    }
}