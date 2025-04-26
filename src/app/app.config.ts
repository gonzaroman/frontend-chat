import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // 👈 Importar HttpClient
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';



import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), // 👈 Añadir aquí
   
    provideClientHydration(withEventReplay())
  ]
};
