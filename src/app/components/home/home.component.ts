import { Component, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { SalaService } from '../../services/salas.service';
import { UsuariosComponent } from "../usuarios/usuarios.component";


@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {
  
}