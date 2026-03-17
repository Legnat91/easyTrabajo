import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  id_empresa: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient); // Inyectamos la herramienta para llamadas reales

  public usuarioActual = signal<Usuario | null>(null);

  // URL del backend
  private apiUrl = 'http://localhost/easyTrabajo/backend/public/api/login';

  constructor() {
    // Al recargar, recuperamos el usuario si ya estaba logueado
    const token = localStorage.getItem('easyparte_token');
    const user = localStorage.getItem('easyparte_user');
    if (token && user) {
      this.usuarioActual.set(JSON.parse(user));
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      // Hacemos un POST real a nuestro PHP
      const respuesta: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/login`, { email, password })
      );

      // Si PHP responde con un 200 OK, guardamos los datos reales
      this.usuarioActual.set(respuesta.usuario);
      localStorage.setItem('easyparte_token', respuesta.token);
      localStorage.setItem('easyparte_user', JSON.stringify(respuesta.usuario));

      this.router.navigate(['/avisos']);
      return true;

    } catch (error) {
      // Si PHP responde con un 401í
      console.error("Fallo de autenticación", error);
      return false;
    }
  }

  logout() {
    this.usuarioActual.set(null);
    localStorage.removeItem('easyparte_token');
    localStorage.removeItem('easyparte_user');
    this.router.navigate(['/login']);
  }
}
