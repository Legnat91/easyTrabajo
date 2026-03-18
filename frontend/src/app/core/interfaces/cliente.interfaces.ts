export interface Cliente {
  id_cliente: number;
  nif: string;
  nombre: string;
  poblacion: string;
  direccion: string;
  prefijo: string;
  contacto: string;
  email: string;
  cuota: number; // En MariaDB los booleanos vienen como 0 o 1 por eso number
  activo: number;
}
