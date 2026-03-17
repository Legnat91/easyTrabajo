import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Comprobamos si hay un usuario logueado en nuestro servicio
  if (authService.usuarioActual()) {
    return true;
  } else {
    // No estás logueado. Te mando a la pantalla de login.
    router.navigate(['/login']);
    return false;
  }
};
