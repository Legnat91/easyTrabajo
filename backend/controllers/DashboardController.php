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
            $id_empleado = $usuarioLogueado->id_empleado;
            $esTecnico = ($usuarioLogueado->rol_nombre === 'Técnico');

            //  Total de Clientes 
            $stmt = $this->conn->prepare("SELECT COUNT(*) as total FROM cliente WHERE id_empresa = :id");
            $stmt->execute(['id' => $id_empresa]);
            $total_clientes = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            // Avisos Pendientes
            $sqlAvisos = "SELECT COUNT(*) as total FROM tarea WHERE id_empresa = :id AND estado IN ('Pendiente', 'En proceso')";
            if ($esTecnico) {
                $sqlAvisos .= " AND id_empleado = :id_emp";
            }

            $stmt = $this->conn->prepare($sqlAvisos);
            $params = ['id' => $id_empresa];
            if ($esTecnico) {
                $params['id_emp'] = $id_empleado;
            }
            $stmt->execute($params);
            $avisos_pendientes = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            // Albaranes Abiertos 
            $sqlPartes = "SELECT COUNT(*) as total FROM parte_trabajo WHERE id_empresa = :id AND estado IN ('Abierto', 'En curso') AND activo = 1";
            if ($esTecnico) {
                $sqlPartes .= " AND id_empleado = :id_emp";
            }

            $stmt = $this->conn->prepare($sqlPartes);
            $stmt->execute($params); 
            $partes_abiertos = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            //Horas Totales del Mes 
            $sqlHoras = "SELECT SUM(horas) as total_horas FROM parte_trabajo 
                     WHERE id_empresa = :id AND estado = 'Cerrado' AND activo = 1
                     AND MONTH(fecha_inicio) = MONTH(CURRENT_DATE()) AND YEAR(fecha_inicio) = YEAR(CURRENT_DATE())";
            if ($esTecnico) {
                $sqlHoras .= " AND id_empleado = :id_emp";
            }

            $stmt = $this->conn->prepare($sqlHoras);
            $stmt->execute($params);
            $horas_mes = $stmt->fetch(PDO::FETCH_ASSOC)['total_horas'] ?? 0;

            echo json_encode([
                "clientesActivos" => (int)$total_clientes,
                "avisosPendientes" => (int)$avisos_pendientes,
                "albaranesAbiertos" => (int)$partes_abiertos,
                "horasMes" => (float)$horas_mes,
                "esVistaPersonal" => $esTecnico // Enviamos esta bandera al frontend
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
}
