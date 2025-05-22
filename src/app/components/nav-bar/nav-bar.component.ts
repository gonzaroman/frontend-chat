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
  private router = inject(Router);
  private auth   = inject(AuthService);
   private platformId = inject(PLATFORM_ID);

  usuario: string | null = null;

  mobileMenuOpen = false;

ngOnInit() {
    // Solo en navegador
    if (isPlatformBrowser(this.platformId)) {
      this.usuario = localStorage.getItem('usuario');
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


