import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

// Definimos cómo es un Usuario en nuestra app
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'Administrador' | 'Tecnico' | 'Recepcion';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  // Señal que guarda el usuario actual. Si es null, nadie está logueado.
  public usuarioActual = signal<Usuario | null>(null);

  constructor() {
    // Al recargar la página, miramos si hay un token guardado para mantener la sesión
    const token = localStorage.getItem('easyparte_token');
    if (token) {
      // Si hay token simulamos que el usuario ya estaba dentro
      this.usuarioActual.set({ id: 5, nombre: 'Juan Pérez', email: 'admin@easyparte.com', rol: 'Administrador' });
    }
  }

  // Función de Login
  login(email: string, password: string): boolean {
    // 🚧 SIMULADOR: Si los datos son estos, le dejamos pasar
    if (email === 'admin@easyparte.com' && password === '1234') {

      const usuarioSimulado: Usuario = { id: 5, nombre: 'Juan Pérez', email, rol: 'Administrador' };

      // Guardamos el usuario en la memoria rápida (Signal)
      this.usuarioActual.set(usuarioSimulado);

      //Guardamos un token falso en el navegador (Para que no se borre al darle a F5)
      localStorage.setItem('easyparte_token', 'token_falso_jwt_123456');

      //Le mandamos al panel principal
      this.router.navigate(['/avisos']);
      return true;

    } else {
      return false; // Credenciales incorrectas
    }
  }

  logout() {
    // Limpiamos todo y lo mandamos a la calle
    this.usuarioActual.set(null);
    localStorage.removeItem('easyparte_token');
    this.router.navigate(['/login']);
  }
}
