import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html'
})
export class Navbar {
  // Señales de la interfaz
  public menuAbierto = signal(false);
  public perfilAbierto = signal(false); // <-- Para el desplegable del PC

  // Simulamos un usuario logueado (Próximamente vendrá del AuthService)
  public usuarioActual = signal({
    id: 5,
    nombre: 'Juan Pérez',
    rol: 'Administrador'
  });

  // Funciones para el menú móvil
  toggleMenu() {
    this.menuAbierto.update(v => !v);
    this.perfilAbierto.set(false); // Si abro el móvil, cierro el del PC por si acaso
  }

  cerrarMenu() {
    this.menuAbierto.set(false);
  }

  // Funciones para el desplegable del perfil en PC
  togglePerfil() {
    this.perfilAbierto.update(v => !v);
  }

  cerrarPerfil() {
    this.perfilAbierto.set(false);
  }
}
