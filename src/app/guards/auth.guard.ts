
import { CanActivateFn } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  // Solo comprobamos localStorage si estamos en el navegador
  if (isPlatformBrowser(platformId)) {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      router.navigate(['/login']);
      return false;
    }
  }

  // En SSR o si hay usuario, permitimos
  return true;
};
