import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { CrearSalaComponent } from './components/crear-sala/crear-sala.component';
import { ChatSalaComponent } from './components/chat-sala/chat-sala.component';
import { ChatPrivadoComponent } from './components/chat-privado/chat-privado.component';
import { SalasListComponent } from './components/salas-list/salas-list.component';
import { PrivadosListComponent } from './components/privados-list/privados-list.component';
import { MisSalasComponent } from './components/mis-salas/mis-salas.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

export const routes: Routes = [
  { path: '', component: HomeComponent,canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'crear-sala', component: CrearSalaComponent },
   { path: 'salas', component: SalasListComponent, canActivate: [authGuard] },
  { path: 'sala/:id', component: ChatSalaComponent },
  { path: 'mis-salas', component: MisSalasComponent, canActivate: [authGuard] },
   { path: 'privados', component: PrivadosListComponent, canActivate: [authGuard] },
  { path: 'privado/:id', component: ChatPrivadoComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: '**', redirectTo: '' } // Cualquier otra ruta ➔ home
];
