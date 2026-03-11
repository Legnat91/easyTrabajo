import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // Mantenemos el .then aquí solo si tu DashboardComponent NO usa "export default"
    loadComponent: () => import('./layouts/dashboard/dashboard').then(m => m.Dashboard),
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
        // Si clientes.component.ts sigue usando "export class ClientesComponent" (sin default),
        // lo dejamos con el .then por ahora hasta que lo refactoricemos.
        loadComponent: () => import('./features/clientes/clientes').then(m => m.Clientes)
      },
      {
        path: '',
        redirectTo: 'avisos',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
