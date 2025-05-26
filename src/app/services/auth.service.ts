// src/app/services/auth.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { map } from 'rxjs/operators';

// Interfaz para la respuesta de la API de login
interface LoginResponse {
  mensaje: string; // Ajustado para coincidir con la respuesta real
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api'; // Usamos el proxy
  private platformId = inject(PLATFORM_ID);
  private usuarioSubject = new BehaviorSubject<string | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      const usuario = localStorage.getItem('usuario')?.trim() || null;
      console.log('AuthService: Inicializando usuario desde localStorage:', usuario);
      this.usuarioSubject.next(usuario);
    } else {
      console.log('AuthService: No inicializado en servidor (SSR)');
    }
  }

  registrar(nombre: string, contraseña: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, { nombre, contraseña });
  }

  login(nombre: string, contraseña: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/login', { nombre, contraseña }).pipe(
      map(response => {
        if (isPlatformBrowser(this.platformId) && response.mensaje === 'Inicio de sesión correcto') {
          this.setUsuario(nombre);
        }
        return response;
      })
    );
  }

  setUsuario(usuario: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('usuario', usuario);
      console.log('AuthService: Estableciendo usuario:', usuario);
      this.usuarioSubject.next(usuario);
    }
  }

  getUsuario(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('usuario')?.trim() || null;
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuario');
      console.log('AuthService: Cerrando sesión');
      this.usuarioSubject.next(null);
    }
  }
}