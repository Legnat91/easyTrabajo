export interface ParteTrabajo{
  id_parte_trabajo?:number;
  id_empresa:number;
  descripcion:string;
  fecha_inicio?:string;
  fecha_fin?:string;
  estado:string;
  id_cliente:number;
  id_tarea?:number|null;
  id_empleado?:number|null;
  horas:number;
  material?:string;
  observaciones?:string;

  //Estos vienen del Join
  cliente_nombre?:string;
  tecnico_nombre?:string;
}
