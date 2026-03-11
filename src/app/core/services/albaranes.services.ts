import { Injectable, signal } from '@angular/core';
import { ParteTrabajo } from '../interfaces/parte-trabajo.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AlbaranesService {
  public albaranes = signal<ParteTrabajo[]>([
    {
    id_parte_trabajo: 1001,
    descripcion: 'He revisado el servidor. Hacía falta reiniciar el router y cambiar un cable de red categoría 6.',
    fecha_inicio: new Date('2026-03-09T10:15:00'),
    estado: 'En curso',
    id_cliente: 1,
    id_tarea: 1,
    id_empleado: 5},

  ]);
  constructor() { }

}
