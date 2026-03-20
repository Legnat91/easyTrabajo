import { inject, Injectable, signal } from '@angular/core';
import { Tarea } from '../interfaces/avisos.interfaces';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TareasService {
  private http=inject(HttpClient);
  private apiUrl='http://localhost/easyTrabajo/backend/public/api';

  public tareas = signal<Tarea[]>([]);

  //OBTENER AVISOS
  cargarTareas(){
    this.http.get<Tarea[]>(`${this.apiUrl}/avisos`).subscribe({
      next:(datosReales)=>this.tareas.set(datosReales),
      error:(error)=>console.error("Error de cargar las tareas",error)
    });
  }

  //CREAR AVISO

  async agregarTarea(nuevaTarea: any): Promise<boolean> {
    try {
      const respuesta: any = await firstValueFrom(this.http.post(`${this.apiUrl}/avisos`, nuevaTarea));
      this.tareas.update(actuales => [respuesta.aviso, ...actuales]);
      return true;
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
      return false;
    }
  }

  //ACTUALIZAR AVISO

  async actualizarTarea(id:number,datosTarea:any):Promise<boolean>{
    try{
      await firstValueFrom(this.http.put(`${this.apiUrl}/avisos/${id}`,datosTarea));
      this.tareas.update(actuales=>
        actuales.map(t=>t.id_tarea===id ? {...t, ...datosTarea}:t)
      );
      return true;
    }catch(error){
      console.error("Error al actualizar la tarea", error);
      return false;
    }
  }

  //ESTADO DEL AVISO

  async asignarTarea(idTarea:number,idEmpleado:number){
    await this.actualizarTarea(idTarea,{id_empleado:idEmpleado,estado:'En proceso'});
  }

  async finalizarTarea(idTarea:number){
    await this.actualizarTarea(idTarea,{estado: 'Finalizada'});

  }

  async cancelarTarea(idTarea:number){
    await this.actualizarTarea(idTarea,{estado:'Cancelada'});

  }

  //ELIMINAR TAREA
  async eliminarTarea(id: number): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/avisos/${id}`));
      this.tareas.update(actuales => actuales.filter(t => t.id_tarea !== id));
      return true;
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      return false;
    }
  }



}

