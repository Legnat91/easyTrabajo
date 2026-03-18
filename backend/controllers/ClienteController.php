<?php
class ClienteController
{
    private $conn;
    private $tabla = "cliente";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    //Funcion para obtener todos los clientes
    public function getAll()
    {
        //Consulta para coger clientes activos
        $query = "SELECT * FROM " . $this->tabla . " WHERE activo=1 ORDER BY nombre ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $clientes_arr = array();

            //Recorremos los resultado y los metemeos en un array
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($clientes_arr, $row);
            }

            //Devolvemos el array en JSON(Por Angular) 
            http_response_code(200); //esto es que esta ok
            echo json_encode($clientes_arr);
        } else {
            //si esta la tabla vacia
            http_response_code(200);
            echo json_encode([]);
        }
    }
    //CREAR UN CLIENTE
    public function create($data)
    {
        if (empty($data->nif) || empty($data->nombre) || empty($data->poblacion) || empty($data->direccion)) {
            http_response_code(400); 
            echo json_encode(["error" => "Faltan datos obligatorios"]);
            return;
        }

        // Preparamos los datos opcionales
        $prefijo = !empty($data->prefijo) ? $data->prefijo : '+34';
        $contacto = !empty($data->contacto) ? $data->contacto : null;
        $email = !empty($data->email) ? $data->email : null;
        $cuota = (!empty($data->cuota) && $data->cuota == true) ? 1 : 0;

        // COMPROBAMOS SI EL NIF YA EXISTE EN LA BASE DE DATOS
        $query_check = "SELECT id_cliente, activo FROM " . $this->tabla . " WHERE nif = :nif LIMIT 1";
        $stmt_check = $this->conn->prepare($query_check);
        $stmt_check->bindParam(":nif", $data->nif);
        $stmt_check->execute();

        if ($stmt_check->rowCount() > 0) {
            $cliente_existente = $stmt_check->fetch(PDO::FETCH_ASSOC);
            
            if ($cliente_existente['activo'] == 1) {
                //  El cliente ya existe y está activo
                http_response_code(400);
                echo json_encode(["error" => "Ya existe un cliente activo con este NIF."]);
                return;
            } else {
                //  El cliente existe pero estaba "borrado" (activo = 0) -> LO RESUCITAMOS
                $id_resucitar = $cliente_existente['id_cliente'];
                $query_reactivar = "UPDATE " . $this->tabla . " 
                                    SET nombre=:nombre, poblacion=:poblacion, direccion=:direccion, 
                                        prefijo=:prefijo, contacto=:contacto, email=:email, cuota=:cuota, activo=1 
                                    WHERE id_cliente = :id";
                
                $stmt_reactivar = $this->conn->prepare($query_reactivar);
                $stmt_reactivar->bindParam(":nombre", $data->nombre);
                $stmt_reactivar->bindParam(":poblacion", $data->poblacion);
                $stmt_reactivar->bindParam(":direccion", $data->direccion);
                $stmt_reactivar->bindParam(":prefijo", $prefijo);
                $stmt_reactivar->bindParam(":contacto", $contacto);
                $stmt_reactivar->bindParam(":email", $email);
                $stmt_reactivar->bindParam(":cuota", $cuota);
                $stmt_reactivar->bindParam(":id", $id_resucitar);

                if ($stmt_reactivar->execute()) {
                    // Lo buscamos para devolvérselo a Angular
                    $query_get = "SELECT * FROM " . $this->tabla . " WHERE id_cliente = :id";
                    $stmt_get = $this->conn->prepare($query_get);
                    $stmt_get->bindParam(":id", $id_resucitar);
                    $stmt_get->execute();
                    $cliente_reactivado = $stmt_get->fetch(PDO::FETCH_ASSOC);

                    http_response_code(200);
                    echo json_encode([
                        "mensaje" => "El cliente estaba dado de baja y ha sido reactivado con los nuevos datos.",
                        "cliente" => $cliente_reactivado 
                    ]);
                    return;
                }
            }
        }

        // El NIF no existe, así que hacemos un INSERT normal
        $query_insert = "INSERT INTO " . $this->tabla . " (nif, nombre, poblacion, direccion, prefijo, contacto, email, cuota, activo) 
                         VALUES (:nif, :nombre, :poblacion, :direccion, :prefijo, :contacto, :email, :cuota, 1)";

        $stmt_insert = $this->conn->prepare($query_insert);
        $stmt_insert->bindParam(":nif", $data->nif);
        $stmt_insert->bindParam(":nombre", $data->nombre);
        $stmt_insert->bindParam(":poblacion", $data->poblacion);
        $stmt_insert->bindParam(":direccion", $data->direccion);
        $stmt_insert->bindParam(":prefijo", $prefijo);
        $stmt_insert->bindParam(":contacto", $contacto);
        $stmt_insert->bindParam(":email", $email);
        $stmt_insert->bindParam(":cuota", $cuota);
        
        try {
            if ($stmt_insert->execute()) {
                $id_insertado = $this->conn->lastInsertId();

                $query_get = "SELECT * FROM " . $this->tabla . " WHERE id_cliente = :id";
                $stmt_get = $this->conn->prepare($query_get);
                $stmt_get->bindParam(":id", $id_insertado);
                $stmt_get->execute();
                $nuevo_cliente = $stmt_get->fetch(PDO::FETCH_ASSOC);

                http_response_code(201);
                echo json_encode([
                    "mensaje" => "Cliente creado con éxito",
                    "cliente" => $nuevo_cliente 
                ]);
            }
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(["error" => "Error al guardar el cliente en la base de datos."]);
        }
    }
    //ACTUALIZAR UN CLIENTE
    public function update($id, $data)
    {
        if (empty($data->nif) || empty($data->nombre)) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan datos obligatorios."]);
            return;
        }
        $query = "UPDATE " . $this->tabla . " SET nif=:nif, nombre=:nombre, poblacion=:poblacion, direccion=:direccion, 
                      prefijo=:prefijo, contacto=:contacto, email=:email, cuota=:cuota 
                  WHERE id_cliente = :id";

        $stmt = $this->conn->prepare($query);
        $prefijo = !empty($data->prefijo) ? $data->prefijo : '+34';
        $contacto = !empty($data->contacto) ? $data->contacto : null;
        $email = !empty($data->email) ? $data->email : null;
        $cuota = (!empty($data->cuota) && $data->cuota == true) ? 1 : 0;

        $stmt->bindParam(":nif", $data->nif);
        $stmt->bindParam(":nombre", $data->nombre);
        $stmt->bindParam(":poblacion", $data->poblacion);
        $stmt->bindParam(":direccion", $data->direccion);
        $stmt->bindParam(":prefijo", $prefijo);
        $stmt->bindParam(":contacto", $contacto);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":cuota", $cuota);
        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["mensaje" => "Cliente actualizado con éxito"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "No se pudo actualizar."]);
        }
    }
    //BORRAR CLIENTE
    public function delete($id)
    {
        // En vez de borrar la fila, lo desactivamos
        $query = "UPDATE " . $this->tabla . " SET activo = 0 WHERE id_cliente = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["mensaje" => "Cliente eliminado con éxito"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "No se pudo eliminar."]);
        }
    }
}
