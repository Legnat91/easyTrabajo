export interface Cliente{
  id_cliente?:number;
  nif:string;
  nombre:string;
  poblacion:string;
  direccion:string;
  prefijo?:number;
  contacto?:number;
  cuota:boolean;
}
