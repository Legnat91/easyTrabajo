import { Injectable, signal } from '@angular/core';
import { Tarea } from '../interfaces/tarea.interfaces';

@Injectable({
  providedIn: 'root',
})
export class TareasService {
  public tareas = signal<Tarea[]>([
    {
      id_tarea: 1,
      descripcion: 'El servidor de la planta 2 no tiene conexión a internet.',
      fecha_alta: new Date('2026-03-09T10:00:00'),
      importancia: 'Alta',
      estado: 'Pendiente',
      persona_contacto: 'María López',
      telefono_contacto: '600123456',
      id_cliente: 1,
      id_empresa: 1
    },
    {
      id_tarea: 2,
      descripcion: 'Instalar paquete de Office en el ordenador de contabilidad.',
      fecha_alta: new Date('2026-03-08T12:30:00'),
      importancia: 'Normal',
      estado: 'En proceso',
      id_empleado: 3, // Asignado al empleado 3
      id_empresa: 1
    },
    {
      id_tarea: 3,
      descripcion: 'Se ha roto la tubería del baño principal.',
      fecha_alta: new Date('2026-03-09T08:15:00'),
      importancia: 'Urgente',
      estado: 'Pendiente',
      id_empresa: 1
    },
    {
      id_tarea: 4,
      descripcion: 'No funciona el wifi',
      fecha_alta: new Date('2026-03-09T12:15:00'),
      fecha_fin: new Date('2026-03-09T13:10:00'),
      importancia: 'Normal',
      estado: 'Cancelada',
      id_empresa: 1
    },
    {
      id_tarea: 5,
      descripcion: 'Se ha roto la tubería del baño principal.',
      fecha_alta: new Date('2026-03-09T08:15:00'),
      importancia: 'Normal',
      estado: 'Finalizada',
      id_empresa: 1
    }

  ]);

  constructor() { };
  obtenerTareasPendinetes() {
    // Métodos que luego conectaremos a PHP
    return this.tareas().filter(t => t.estado === 'Pendiente');
  };
  obtenerTareasAsignadas(idEmpleado: number) {
    return this.tareas().filter(t => t.id_empleado === idEmpleado)
  };

  asignarTarea(idTarea: number, idEmpleado: number) {
    // Usamos .update() para modificar la señal de forma reactiva
    this.tareas.update(tareasActuales => {
      // Recorremos el array actual
      return tareasActuales.map(tarea => {
        // Si encontramos la tarea que queremos coger...
        if (tarea.id_tarea === idTarea) {
          return {
            ...tarea,
            id_empleado: idEmpleado,
            estado: 'En proceso'
          };
        }
        return tarea;
      });
    });


    /* ===IMPORTANTE===
        Cuando conectes tu PHP, este método primero hará un:
        this.http.put(`tu-api/tareas/${idTarea}`, { id_empleado: idEmpleado, estado: 'En proceso' }).subscribe(...)
        Y luego actualizará la señal. ¡Pero la lógica visual será la misma!
      */
  }



  // Método para crear una nueva tarea
  agregarTarea(nuevaTarea: any) { // Usamos 'any' momentáneamente o tipamos parcialmente
    this.tareas.update(tareasActuales => {
      // Calculamos un ID falso (en la vida real esto lo hace tu Base de Datos con AUTO_INCREMENT)
      const maxId = tareasActuales.length > 0 ? Math.max(...tareasActuales.map(t => t.id_tarea || 0)) : 0;

      const tareaCompleta = {
        ...nuevaTarea,
        id_tarea: maxId + 1,
        fecha_alta: new Date(), // La fecha de creación es ahora
        estado: nuevaTarea.id_empleado ? 'En proceso' : 'Pendiente'     // Por defecto nace pendiente
      };

      // Devolvemos el array actual + la nueva tarea al principio
      return [tareaCompleta, ...tareasActuales];
    });
  }
}

