import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Este servicio estará disponible para toda la app
})
export class SalaService {
  private apiUrl = '/api/salas'; // URL base para las rutas relacionadas con salas

  constructor(private http: HttpClient) {}

  /** 
   * Obtiene todas las salas disponibles (públicas).
   * GET /api/salas
   */
  obtenerSalas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /** 
   * Obtiene solo las salas creadas por un usuario específico.
   * GET /api/salas/propias?creador=nombreUsuario
   */
  obtenerMisSalas(usuario: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/propias?creador=${encodeURIComponent(usuario)}`);
  }

  /** 
   * Crea una nueva sala con nombre e identificador del creador.
   * POST /api/salas
   */
  crearSala(nombre: string, creador: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { nombre, creador });
  }

  /** 
   * Elimina una sala según su ID.
   * DELETE /api/salas/:id
   */
  eliminarSala(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /** 
   * Actualiza el nombre de una sala concreta (por ejemplo desde "Mis Salas").
   * PUT /api/salas/:id
   */
  actualizarSalaNombre(id: string, nombre: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { nombre });
  }
}
