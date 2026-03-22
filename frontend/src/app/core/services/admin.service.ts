import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Empleado, Rol, UsuarioAdmin } from '../interfaces/admin.interfaces';


@Injectable({
  providedIn: 'root'
})

export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost/easyTrabajo/backend/public/api';

  public roles = signal<Rol[]>([]);
  public empleados = signal<Empleado[]>([]);
  public usuarios = signal<UsuarioAdmin[]>([]);

  // CARGAR DATOS
  cargarRoles() {
    this.http.get<Rol[]>(`${this.apiUrl}/roles`).subscribe(res => this.roles.set(res));
  }

  cargarEmpleados() {
    this.http.get<Empleado[]>(`${this.apiUrl}/empleados`).subscribe(res => this.empleados.set(res));
  }

  cargarUsuarios() {
    this.http.get<UsuarioAdmin[]>(`${this.apiUrl}/usuarios`).subscribe(res => this.usuarios.set(res));
  }

  // GUARDAR DATOS
  async agregarEmpleado(datos: any): Promise<boolean> {
    try {
      const res: any = await firstValueFrom(this.http.post(`${this.apiUrl}/empleados`, datos));
      this.empleados.update(actuales => [res.empleado, ...actuales]);
      return true;
    } catch (error) {
      console.error("Error al guardar empleado:", error);
      return false;
    }
  }

  async agregarUsuario(datos: any): Promise<boolean> {
    try {
      await firstValueFrom(this.http.post(`${this.apiUrl}/usuarios`, datos));

      this.cargarUsuarios();
      return true;
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      return false;
    }
  }
}
