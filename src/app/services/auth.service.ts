// Servicio de autenticación para login, registro y gestión del usuario
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interfaz para la respuesta del login
interface LoginResponse {
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // URL base del backend (ajustable si cambia)
  private apiUrl = '/api';

  // BehaviorSubject mantiene el estado del usuario actual.
  // Se inicializa leyendo del localStorage si estamos en navegador.
  private usuarioSubject = new BehaviorSubject<string | null>(
    typeof window !== 'undefined' && window.localStorage
      ? window.localStorage.getItem('usuario')?.trim() || null
      : null
  );

  // Observable para que otros componentes puedan reaccionar a cambios en el usuario
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Llama a la API para registrar un nuevo usuario
  registrar(nombre: string, contraseña: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, { nombre, contraseña });
  }

  // Llama a la API para iniciar sesión
  login(nombre: string, contraseña: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { nombre, contraseña }).pipe(
      map(res => {
        // Si la respuesta es exitosa, actualiza el estado del usuario
        if (res.mensaje === 'Inicio de sesión correcto') {
          this.setUsuario(nombre);
        }
        return res;
      })
    );
  }

  // Guarda el usuario en localStorage y actualiza el observable
  setUsuario(usuario: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('usuario', usuario);
      this.usuarioSubject.next(usuario);
    }
  }

  // Devuelve el nombre del usuario guardado (si existe)
  getUsuario(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('usuario')?.trim() || null;
    }
    return null;
  }

  // Cierra la sesión: borra del localStorage y actualiza el observable
  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('usuario');
      this.usuarioSubject.next(null);
    }
  }
}
