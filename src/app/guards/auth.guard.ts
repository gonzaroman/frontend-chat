// src/app/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Solo en cliente existe window.localStorage
  let usuario: string | null = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    usuario = window.localStorage.getItem('usuario')?.trim() || null;
  }

  if (usuario) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
