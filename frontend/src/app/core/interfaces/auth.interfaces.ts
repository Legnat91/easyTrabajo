export interface Usuario {
  id_usuario: number;
  nombre: string;
  email?: string;
  id_empresa?: number;
  id_empleado?: number;
  id_rol?: number;
  rol_nombre?: string;
}
