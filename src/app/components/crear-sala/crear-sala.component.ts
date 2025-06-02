
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';                // Para usar [(ngModel)] en el HTML
import { SalaService } from '../../services/salas.service';  // Servicio para gestionar salas
import { Router } from '@angular/router';                    // Para redireccionar tras crear sala

@Component({
  selector: 'app-crear-sala',           // Nombre de etiqueta del componente
  imports: [FormsModule],               // Importamos FormsModule para usar formularios
  templateUrl: './crear-sala.component.html',  // HTML asociado
  styleUrl: './crear-sala.component.css'       // CSS asociado
})
export class CrearSalaComponent {
  nombreSala: string = '';  // Variable vinculada al input (campo de nombre)
  error: string = '';       // Para mostrar errores si ocurren

  // Inyectamos el servicio y el router para navegar
  constructor(private salaService: SalaService, private router: Router) {}

  // Método para crear una nueva sala
  crear() {
    // Obtenemos el nombre del usuario desde localStorage
    const creador = localStorage.getItem('usuario');

    // Validamos si el usuario está logueado
    if (!creador) {
      this.error = 'Debes iniciar sesión.';
      return;
    }

    // Validamos que el nombre no esté vacío o solo espacios
    if (!this.nombreSala.trim()) {
      this.error = 'El nombre de la sala no puede estar vacío.';
      return;
    }

    // Llamamos al servicio para crear la sala
    this.salaService.crearSala(this.nombreSala, creador).subscribe({
      next: (data) => {
        // Redirige al usuario a la nueva sala creada
        this.router.navigate(['/sala', data.id]);
      },
      error: (err) => {
        console.error(err);
        // Muestra el error recibido desde el backend o un mensaje genérico
        this.error = err.error?.error || 'Error al crear la sala';
      }
    });
  }
}
