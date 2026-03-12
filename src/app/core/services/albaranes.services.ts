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
      id_empleado: 5
    },

  ]);
  agregarAlbaram(nuevoAlbaran: any) {
    this.albaranes.update(albarenesActuales=>{
      const maxId=albarenesActuales.length>0?Math.max(...albarenesActuales.map(a=>a.id_parte_trabajo||0)):1000;

      const albaranesCompleto={
        ...nuevoAlbaran,
        id_parte_trabajo:maxId+1,
        fecha_inicio:new Date(),
        estad:'Abierto'//estado base
      };
      return[albaranesCompleto,...albarenesActuales];
    })
  }
}
