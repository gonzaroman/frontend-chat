import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000'); // Ajusta si tu backend corre en otra URL/puerto
  }

  emit(evento: string, data?: any) {
    this.socket.emit(evento, data);
  }

  on<T>(evento: string): Observable<T> {
    return new Observable<T>(observer => {
      this.socket.on(evento, (payload: T) => {
        observer.next(payload);
      });
      // opcional: limpiar listeners al completar
      return () => this.socket.off(evento);
    });
  }
}

