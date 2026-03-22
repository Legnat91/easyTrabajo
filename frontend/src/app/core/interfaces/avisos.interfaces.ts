export interface Tarea {
  id_tarea?: number;
  descripcion: string;
  importancia: string;
  estado: string;
  persona_contacto?: string;
  telefono_contacto?: string;
  id_cliente: number;
  id_empleado?: number;
  id_empresa: number;
  id_usuario_creador: number;
  fecha_alta?: string;
  fecha_fin?: string;
  cliente_nombre?: string;
  tecnico_nombre?: string;
}
