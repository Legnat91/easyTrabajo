<?php

class DateBase {
    //Credenciales
    private $host="localhost";
    private $db_name="easyParte";
    private $username="root";
    private $password="";
    public $conn;

    //Funcion para conectar
    public function getConnection(){
        $this->conn=null;

        try{
            //Creamos la conexion PDO
            $this->conn=new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8",
                $this->username,
                $this->password
            );

        // Le decimos a PDO que si hay un error lance una Excepción
        $this->conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

        }catch(PDOException $exception){
            //Si algo fallo
            echo json_encode(["error"=>"Error de conexión a la base de datos: " . $exception->getMessage()]);


        }
        return $this->conn;
    }
}