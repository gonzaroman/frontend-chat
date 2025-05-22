import { Component } from '@angular/core';

import { SalasListComponent } from "../../components/salas-list/salas-list.component";
import { UsuariosComponent } from "../../components/usuarios/usuarios.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map, Observable, timer } from 'rxjs';

@Component({
  selector: 'app-homepage',
  standalone: true,               // ← imprescindible
  imports: [
    CommonModule,                 // ngIf, @for/@if, ngFor…
    RouterModule,                 // routerLink en los child‐components
    SalasListComponent,           // <app-salas-list>
    UsuariosComponent             // <app-usuarios>
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  
}
