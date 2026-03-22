export interface Rol {
  id_rol: number;
  nombre: string;
}

export interface Empleado {
  id_empleado?: number;
  nombre: string;
  apellido: string;
  apellido_2?: string;
  nif?: string;
  movil?: string;
}

export interface UsuarioAdmin {
  id_usuario?: number;
  nombre: string;
  email: string;
  id_rol: number;
  rol_nombre?: string;
  id_empleado?: number;
  empleado_nombre?: string;
}
