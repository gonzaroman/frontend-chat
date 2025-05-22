import { Component } from '@angular/core';
import { SalasListComponent } from "../salas-list/salas-list.component";
import { UsuariosComponent } from "../usuarios/usuarios.component";

@Component({
  selector: 'app-inicio',
  imports: [SalasListComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

}
