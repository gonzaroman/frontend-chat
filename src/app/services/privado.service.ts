// src/app/services/privado.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Conversacion {
  id: string;
  con: string;
}

@Injectable({ providedIn: 'root' })
export class PrivadoService {
  constructor(private http: HttpClient) {}
  obtenerConversaciones(usuario: string): Observable<Conversacion[]> {
    return this.http.get<Conversacion[]>(`/api/privados/${usuario}`);
  }
}