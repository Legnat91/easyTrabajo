<?php

class Usuario
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getByEmailActivo($email)
    {
        $query = "SELECT u.id_usuario, u.nombre, u.email, u.id_empresa, u.id_empleado, u.password_hash,
                         r.id_rol, r.nombre as rol_nombre
                  FROM usuario u
                  LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
                  LEFT JOIN rol r ON ur.id_rol = r.id_rol
                  WHERE u.email = :email AND u.activo = 1
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAllByEmpresa($idEmpresa)
    {
        $query = "SELECT u.id_usuario, u.nombre, u.email, r.nombre as rol_nombre, u.activo
                  FROM usuario u
                  LEFT JOIN usuario_rol ur ON u.id_usuario = ur.id_usuario
                  LEFT JOIN rol r ON ur.id_rol = r.id_rol
                  WHERE u.id_empresa = :id_empresa AND u.activo = 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_empresa', $idEmpresa);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data, $idEmpresa)
    {
        $passwordHash = password_hash($data->password, PASSWORD_BCRYPT);

        $query = "INSERT INTO usuario (nombre, email, password_hash, id_empresa, id_empleado, activo)
                  VALUES (:nombre, :email, :pass, :id_empresa, :id_empleado, 1)";

        $stmt = $this->conn->prepare($query);

        $idEmpleado = property_exists($data, 'id_empleado') && !empty($data->id_empleado)
            ? $data->id_empleado
            : null;

        $stmt->bindParam(':nombre', $data->nombre);
        $stmt->bindParam(':email', $data->email);
        $stmt->bindParam(':pass', $passwordHash);
        $stmt->bindParam(':id_empresa', $idEmpresa);
        $stmt->bindParam(':id_empleado', $idEmpleado);

        $stmt->execute();

        $idUsuario = $this->conn->lastInsertId();

        $idRol = !empty($data->id_rol) ? $data->id_rol : 2;

        $queryRol = "INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (:uid, :rid)";
        $stmtRol = $this->conn->prepare($queryRol);
        $stmtRol->bindParam(':uid', $idUsuario);
        $stmtRol->bindParam(':rid', $idRol);
        $stmtRol->execute();

        return $idUsuario;
    }
}