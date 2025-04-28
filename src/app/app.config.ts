import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // 👈 Importar HttpClient
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideSocketIo } from 'ngx-socket-io';




import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), // 👈 Añadir aquí
   
    provideClientHydration(withEventReplay()),
    provideSocketIo({
      url: 'http://localhost:3000', // Dirección de tu servidor de sockets
      options: {} // Opcionalmente opciones
    })
  ]
};
