import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  nombre: string = '';
  contrasena: string = '';
  repetirContrasena: string = '';

  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  registrar() {
    if (this.contrasena !== this.repetirContrasena) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.authService.registrar(this.nombre, this.contrasena).subscribe({
      next: () => {
        // Guardar el nombre en localStorage para recordar sesión
        localStorage.setItem('usuario', this.nombre);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.error || 'Error al registrar';
      }
    });
  }
}
