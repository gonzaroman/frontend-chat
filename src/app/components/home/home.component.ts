import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { SalaService } from '../../services/salas.service';


@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  salas: any[] = [];

  constructor(private salaService: SalaService, private router: Router) {}

  ngOnInit() {
    this.cargarSalas();
  }

  cargarSalas() {
    this.salaService.obtenerSalas().subscribe({
      next: (salas) => {
        this.salas = salas;
      },
      error: (err) => {
        console.error('Error cargando salas', err);
      }
    });
  }

  entrarSala(id: string) {
    this.router.navigate(['/sala', id]);
  }

  crearSala() {
    this.router.navigate(['/crear-sala']);
  }
}