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
import { HomepageComponent } from './pages/homepage/homepage.component';

export const routes: Routes = [
  { path: '', component: HomeComponent},
   { path: 'inicio', component: HomepageComponent   },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'crear-sala', component: CrearSalaComponent, canActivate: [authGuard]  },
   { path: 'salas', component: SalasListComponent, canActivate: [authGuard] },
  { path: 'sala/:id', component: ChatSalaComponent , canActivate: [authGuard] },
  { path: 'mis-salas', component: MisSalasComponent, canActivate: [authGuard] },
   { path: 'privados', component: PrivadosListComponent, canActivate: [authGuard] },
  { path: 'privado/:id', component: ChatPrivadoComponent, canActivate: [authGuard]  },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard]  },
  
  { path: '**', redirectTo: '' } // Cualquier otra ruta ➔ home
];
