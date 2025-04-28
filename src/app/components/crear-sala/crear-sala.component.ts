import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SalaService } from '../../services/salas.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-sala',
  imports: [FormsModule],
  templateUrl: './crear-sala.component.html',
  styleUrl: './crear-sala.component.css'
})
export class CrearSalaComponent {
  nombreSala: string = '';
  error: string = '';

  constructor(private salaService: SalaService, private router: Router) {}

  crear() {
    const creador = localStorage.getItem('usuario'); // Obtenemos el usuario logueado
    if (!creador) {
      this.error = 'Debes iniciar sesión.';
      return;
    }

    if (!this.nombreSala.trim()) {
      this.error = 'El nombre de la sala no puede estar vacío.';
      return;
    }

    this.salaService.crearSala(this.nombreSala, creador).subscribe({
      next: (data) => {
        this.router.navigate(['/sala', data.id]);
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.error || 'Error al crear la sala';
      }
    });
  }
}