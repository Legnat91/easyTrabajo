<?php

class DashboardController
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // OBTENER RESUMEN DE ESTADÍSTICAS
    public function getResumen($usuarioLogueado)
    {
        try {
            $id_empresa = $usuarioLogueado->id_empresa;

            //Total de Clientes Activos
            $stmt = $this->conn->prepare("SELECT COUNT(*) as total FROM cliente WHERE id_empresa = :id");
            $stmt->execute(['id' => $id_empresa]);
            $total_clientes = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            //Avisos 
            $stmt = $this->conn->prepare("SELECT COUNT(*) as total FROM tarea WHERE id_empresa = :id AND estado IN ('Pendiente', 'En proceso')");
            $stmt->execute(['id' => $id_empresa]);
            $avisos_pendientes = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            // Albaranes 
            $stmt = $this->conn->prepare("SELECT COUNT(*) as total FROM parte_trabajo WHERE id_empresa = :id AND estado IN ('Abierto', 'En curso') AND activo = 1");
            $stmt->execute(['id' => $id_empresa]);
            $partes_abiertos = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            
            $queryHoras = "SELECT SUM(horas) as total_horas 
                           FROM parte_trabajo 
                           WHERE id_empresa = :id 
                           AND estado = 'Cerrado' 
                           AND activo = 1
                           AND MONTH(fecha_inicio) = MONTH(CURRENT_DATE()) 
                           AND YEAR(fecha_inicio) = YEAR(CURRENT_DATE())";
            $stmt = $this->conn->prepare($queryHoras);
            $stmt->execute(['id' => $id_empresa]);
            
            $horas_mes = $stmt->fetch(PDO::FETCH_ASSOC)['total_horas'] ?? 0;

            
            http_response_code(200);
            echo json_encode([
                "clientesActivos" => (int)$total_clientes,
                "avisosPendientes" => (int)$avisos_pendientes,
                "albaranesAbiertos" => (int)$partes_abiertos,
                "horasMes" => (float)$horas_mes
            ]);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al calcular estadísticas: " . $e->getMessage()]);
        }
    }
}