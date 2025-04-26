import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaService {
  private apiUrl = '/api/salas';

  constructor(private http: HttpClient) {}

  obtenerSalas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearSala(nombre: string, creador: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { nombre, creador });
  }
}
