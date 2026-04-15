import { Routes } from '@angular/router';
import { authGuard } from './core/services/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // RUTA PÚBLICA
  {
    path: 'login',
    title: 'Iniciar Sesión - EasyParte',
    loadComponent: () => import('./features/auth/login')
  },

  // RUTAS PRIVADAS
  {
    path: '',
    loadComponent: () => import('./layouts/dashboard/dashboard'),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard')
      },
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
      // Doble capa de seguridad
      {
        path: 'administracion',
        title: 'Administración - EasyParte',
        loadComponent: () => import('./features/administracion/administracion'),
        canActivate: [roleGuard('Administrador')] // Solo entra si es Admin
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // RUTA COMODÍN
  {
    path: '**',
    redirectTo: 'login'
  }
];
