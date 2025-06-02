

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Provee el servicio HttpClient a toda la app
import { provideClientHydration, withEventReplay } from '@angular/platform-browser'; // Para apps renderizadas en servidor
import { provideSocketIo } from 'ngx-socket-io'; // Para integrar WebSocket con la librería ngx-socket-io

// Importamos las rutas definidas para el enrutamiento de la aplicación
import { routes } from './app.routes';

// Exportamos la configuración principal de la aplicación
export const appConfig: ApplicationConfig = {
  providers: [
    // Optimiza la detección de cambios para eventos agrupados
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Provee el sistema de enrutamiento con nuestras rutas definidas
    provideRouter(routes),

    // Hace disponible el servicio HttpClient para peticiones HTTP
    provideHttpClient(), 

    // Habilita la hidratación del cliente (SSR + reactivación de eventos)
    provideClientHydration(withEventReplay()),

    // Configura la conexión WebSocket para toda la app usando ngx-socket-io
    provideSocketIo({
      url: 'http://localhost:3000', // Dirección del servidor WebSocket (cambiar por Render en producción)
      options: {} // Puedes añadir opciones como reconexión o headers
    })
  ]
};
