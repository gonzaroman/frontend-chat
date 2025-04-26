import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //private apiUrl = 'http://localhost:3000'; // URL del backend
  private apiUrl = '/api'; // Usamos el proxy



  constructor(private http: HttpClient) { }

  registrar(nombre: string, contraseña: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, { nombre, contraseña });
  }

  login(nombre: string, contraseña: string): Observable<any> {
    return this.http.post('/api/login', { nombre, contraseña });
  }
  
}
