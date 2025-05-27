

  import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),        // ← importa el módulo HTTP
   // provideRouter(routes, withHashLocation())    // ← si usas hash
    provideRouter(routes)    // ← si usas hash
  ]
})
.catch(err => console.error(err));

