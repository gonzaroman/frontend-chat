// src/app/components/nav-bar/nav-bar.component.ts
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  private router = inject(Router);           // Inyección del servicio de navegación
  private auth   = inject(AuthService);      // Servicio de autenticación
  private platformId = inject(PLATFORM_ID);  // Detecta si se ejecuta en navegador o servidor

  usuario: string | null = null;             // Nombre del usuario actual
  mobileMenuOpen = false;                    // Estado del menú en vista móvil


  ngOnInit() {
    // Solo ejecutamos si estamos en el navegador (evita errores en SSR)
    if (isPlatformBrowser(this.platformId)) {
      // Nos suscribimos al observable del usuario en el servicio Auth
      this.auth.usuario$.subscribe((nombre) => {
        this.usuario = nombre;  // Actualiza la variable al loguearse o hacer logout
      });
    }
  }


  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

 
 

  logout() {
    this.auth.logout();             // Limpia localStorage
    this.router.navigate(['/login']);

  }
}


