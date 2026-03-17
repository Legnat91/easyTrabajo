export interface Tarea {
  id_tarea?: number;
  descripcion: string;
  fecha_alta: Date | string;
  fecha_fin?: Date | string;
  importancia: 'Baja' | 'Normal' | 'Alta' | 'Urgente';
  estado: 'Pendiente' | 'En proceso' | 'Finalizada' | 'Cancelada';
  persona_contacto?: string;
  telefono_contacto?: string;

  //Claves foraneas
  id_empleado?: number;
  id_cliente?: number;
  id_departamento?: number;
  id_empresa: number;
}
