<?php
class RolController
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getAll()
    {
        $query = "SELECT * FROM rol ORDER BY id_rol ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $roles_arr = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($roles_arr, $row);
            }
            http_response_code(200);
            echo json_encode($roles_arr);
        } else {
            http_response_code(200);
            echo json_encode([]);
        }
    }
}
?>