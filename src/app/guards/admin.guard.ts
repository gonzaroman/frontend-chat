import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Obtener el usuario desde localStorage
  const usuario = localStorage.getItem('usuario');

  // Si es admin, permitir acceso
  if (usuario === 'admin') return true;

  // Si no, redirigir
  router.navigate(['/']);
  return false;
};
