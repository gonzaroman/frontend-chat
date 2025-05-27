// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface LoginResponse { mensaje: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api';
  // Arranca sincronamente con el valor de localStorage en el cliente
  private usuarioSubject = new BehaviorSubject<string | null>(
    typeof window !== 'undefined' && window.localStorage
      ? window.localStorage.getItem('usuario')?.trim() || null
      : null
  );
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  registrar(nombre: string, contraseña: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, { nombre, contraseña });
  }

  login(nombre: string, contraseña: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { nombre, contraseña }).pipe(
      map(res => {
        if (res.mensaje === 'Inicio de sesión correcto') {
          this.setUsuario(nombre);
        }
        return res;
      })
    );
  }

  setUsuario(usuario: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('usuario', usuario);
      this.usuarioSubject.next(usuario);
    }
  }

  getUsuario(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('usuario')?.trim() || null;
    }
    return null;
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('usuario');
      this.usuarioSubject.next(null);
    }
  }
}
