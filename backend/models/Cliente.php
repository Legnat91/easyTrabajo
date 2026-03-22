<?php

class Cliente
{
    private $conn;
    private $tabla = "cliente";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getAllByEmpresa($idEmpresa)
    {
        $query = "SELECT * FROM " . $this->tabla . " 
                  WHERE id_empresa = :id_empresa AND activo = 1 
                  ORDER BY nombre ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_empresa", $idEmpresa);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data, $idEmpresa)
    {
        $query = "INSERT INTO " . $this->tabla . " 
                  (nif, nombre, poblacion, direccion, prefijo, contacto, cuota, id_empresa, activo) 
                  VALUES (:nif, :nombre, :poblacion, :direccion, :prefijo, :contacto, :cuota, :id_empresa, 1)";

        $stmt = $this->conn->prepare($query);

        $cuota = isset($data->cuota) && $data->cuota ? 1 : 0;

        $stmt->bindParam(":nif", $data->nif);
        $stmt->bindParam(":nombre", $data->nombre);
        $stmt->bindParam(":poblacion", $data->poblacion);
        $stmt->bindParam(":direccion", $data->direccion);
        $stmt->bindParam(":prefijo", $data->prefijo);
        $stmt->bindParam(":contacto", $data->contacto);
        $stmt->bindParam(":cuota", $cuota);
        $stmt->bindParam(":id_empresa", $idEmpresa);

        $ok = $stmt->execute();

        if (!$ok) {
            return false;
        }

        return [
            "id_cliente" => $this->conn->lastInsertId(),
            "nombre" => $data->nombre,
            "nif" => $data->nif
        ];
    }

    public function update($id, $data, $idEmpresa)
    {
        $query = "UPDATE " . $this->tabla . " 
                  SET nombre = :nombre,
                      nif = :nif,
                      direccion = :direccion,
                      telefono = :telefono,
                      email = :email
                  WHERE id_cliente = :id AND id_empresa = :id_empresa";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":nombre", $data->nombre);
        $stmt->bindParam(":nif", $data->nif);
        $stmt->bindParam(":direccion", $data->direccion);
        $stmt->bindParam(":telefono", $data->telefono);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":id_empresa", $idEmpresa);

        return $stmt->execute();
    }

    public function softDelete($id, $idEmpresa)
    {
        $query = "UPDATE " . $this->tabla . " 
                  SET activo = 0
                  WHERE id_cliente = :id AND id_empresa = :id_empresa";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":id_empresa", $idEmpresa);

        return $stmt->execute();
    }
}
