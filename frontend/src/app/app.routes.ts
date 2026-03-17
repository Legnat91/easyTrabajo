import { Routes } from '@angular/router';
import { authGuard } from './core/services/auth.guard';

export const routes: Routes = [
  // 1. RUTA PÚBLICA (Sin Navbar, sin protección)
  {
    path: 'login',
    title: 'Iniciar Sesión - EasyParte',
    loadComponent: () => import('./features/auth/login')
  },

  // 2. RUTAS PRIVADAS (Protegidas por el Guard y con Navbar)
  {
    path: '',
    // Cargamos el "Layout" que contiene el Navbar y otro <router-outlet> dentro
    loadComponent: () => import('./layouts/dashboard/dashboard'),
    canActivate: [authGuard], // 🛡️ ¡EL PORTERO EN LA PUERTA!

    // Todos estos son "hijos" del Dashboard, así que heredan su Navbar y su protección
    children: [
      {
        path: 'avisos',
        title: 'Avisos - EasyParte',
        loadComponent: () => import('./features/avisos/avisos')
      },
      {
        path: 'albaranes',
        title: 'Albaranes - EasyParte',
        loadComponent: () => import('./features/albaranes/albaranes')
      },
      {
        path: 'clientes',
        title: 'Clientes - EasyParte',
        loadComponent: () => import('./features/clientes/clientes')
      },
      {
        path: '',
        redirectTo: 'avisos',
        pathMatch: 'full'
      }
    ]
  },

  // 3. RUTA COMODÍN (Si escriben una URL que no existe, al login)
  {
    path: '**',
    redirectTo: 'login'
  }
];
