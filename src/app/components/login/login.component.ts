import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  nombre: string = '';
  contrasena: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.nombre, this.contrasena).subscribe({
      next: () => {
        localStorage.setItem('usuario', this.nombre);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.error || 'Error al iniciar sesión';
      }
    });
  }
}
