// Importamos los decoradores y dependencias necesarias
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Para trabajar con [(ngModel)]
import { AuthService } from '../../services/auth.service';  // Servicio de autenticación
import { Router } from '@angular/router';  // Para redireccionar tras el registro

// Decorador del componente
@Component({
  selector: 'app-registro',                   // Selector del componente
  imports: [FormsModule],                    // Módulo necesario para ngModel en formularios
  templateUrl: './registro.component.html',  // Ruta del HTML de la plantilla
  styleUrls: ['./registro.component.css']    // Ruta del CSS del componente
})
export class RegistroComponent {
  // Variables para enlazar con el formulario
  nombre: string = '';
  contrasena: string = '';
  repetirContrasena: string = '';
  error: string = '';  // Para mostrar errores en pantalla

  // Inyectamos el servicio de autenticación y el router
  constructor(private authService: AuthService, private router: Router) {}

  // Método que se ejecuta al enviar el formulario
  registrar() {
    // Validamos que las contraseñas coincidan
    if (this.contrasena !== this.repetirContrasena) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    // Llamamos al servicio para registrar al usuario
    this.authService.registrar(this.nombre, this.contrasena).subscribe({
      // Si todo va bien...
      next: () => {
        localStorage.setItem('usuario', this.nombre);  // Guardamos el usuario en localStorage
        this.router.navigate(['/']);  // Redirigimos a la pantalla principal
      },
      // Si hay un error, lo mostramos
      error: (err) => {
        console.error(err);  // Mostramos el error en consola
        this.error = err.error?.error || 'Error al registrar';  // Mostramos un mensaje al usuario
      }
    });
  }
}
