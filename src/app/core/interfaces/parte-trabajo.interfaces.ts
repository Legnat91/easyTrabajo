export interface ParteTrabajo{
  id_parte_trabajo?:number;
  descripcion:string;
  fecha_inicio:Date|string;
  fecha_fin?:Date|string;
  estado:'Abierto'|'En curso'|'Cerrado'|'Pausado';

  //Claves Foraneas
  id_cliente:number;
  id_tarea?:number;
  id_empleado?:number;
};
