import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (rolRequerido: string): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const usuario = authService.usuarioActual();

    // Si el usuario existe y tiene el rol necesario pasa
    if (usuario && usuario.rol_nombre === rolRequerido) {
      return true;
    }

    // Si no tiene permiso, lo redirigimos al dashboard o avisos
    console.warn('Acceso denegado: Se requiere rol', rolRequerido);
    router.navigate(['/avisos']);
    return false;
  };
};
