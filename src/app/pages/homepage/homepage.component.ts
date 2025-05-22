import { Component } from '@angular/core';

import { SalasListComponent } from "../../components/salas-list/salas-list.component";
import { UsuariosComponent } from "../../components/usuarios/usuarios.component";


@Component({
  selector: 'app-homepage',
  imports: [SalasListComponent, UsuariosComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
