// Importamos los módulos necesarios
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';              // Para trabajar con [(ngModel)]
import { AuthService } from '../../services/auth.service'; // Servicio para autenticación
import { Router } from '@angular/router';                  // Para redirigir tras iniciar sesión

@Component({
  selector: 'app-login',                              // Selector para usar este componente
  standalone: true,                                   // Es un componente independiente (Angular 15+)
  imports: [FormsModule],                             // Importa FormsModule para formularios
  templateUrl: './login.component.html',              // Ruta del archivo HTML del componente
  styleUrls: ['./login.component.css']                // Ruta del CSS del componente
})
export class LoginComponent {
  // Variables para enlazar con el formulario
  nombre: string = '';        // Usuario introducido
  contrasena: string = '';    // Contraseña introducida
  error: string = '';         // Mensaje de error si el login falla

  // Inyectamos el AuthService y el Router
  constructor(private authService: AuthService, private router: Router) {}

  // Método para hacer login
  login() {
    // Llama al método login del servicio de autenticación
    this.authService.login(this.nombre, this.contrasena).subscribe({
      next: () => {
        // Si todo va bien, guarda el usuario en localStorage
        localStorage.setItem('usuario', this.nombre);
        // Y redirige a la página principal
        this.router.navigate(['/']);
      },
      error: (err) => {
        // Si hay error, muestra el mensaje recibido desde el servidor o uno por defecto
        console.error(err);
        this.error = err.error?.error || 'Error al iniciar sesión';
      }
    });
  }
}
