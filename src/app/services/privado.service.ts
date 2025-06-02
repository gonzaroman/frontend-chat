// Servicio para obtener las conversaciones privadas de un usuario

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz que representa una conversación privada
export interface Conversacion {
  id: string;     // ID de la sala privada (ej. "usuario1-usuario2")
  con: string;    // Nombre del otro usuario con el que se conversa
}

@Injectable({ providedIn: 'root' }) // Este servicio se puede inyectar en toda la app
export class PrivadoService {
  // Inyectamos HttpClient para hacer peticiones HTTP al backend
  constructor(private http: HttpClient) {}

  // Llama al backend para obtener las conversaciones privadas del usuario
  obtenerConversaciones(usuario: string): Observable<Conversacion[]> {
    // Devuelve un observable con un array de conversaciones del usuario
    return this.http.get<Conversacion[]>(`/api/privados/${usuario}`);
  }
}
