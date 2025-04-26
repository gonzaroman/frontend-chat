import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { CrearSalaComponent } from './components/crear-sala/crear-sala.component';
import { ChatSalaComponent } from './components/chat-sala/chat-sala.component';
import { ChatPrivadoComponent } from './components/chat-privado/chat-privado.component';

export const routes: Routes = [
  { path: '', component: HomeComponent,canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'crear-sala', component: CrearSalaComponent },
  { path: 'sala/:id', component: ChatSalaComponent },
  { path: 'privado/:id', component: ChatPrivadoComponent },
  { path: '**', redirectTo: '' } // Cualquier otra ruta ➔ home
];
