import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.socket = io('http://localhost:3000'); // Ajusta si tu backend corre en otra URL/puerto

    if (isPlatformBrowser(this.platformId)) {
      const usuario = localStorage.getItem('usuario');
     if (usuario) {
        this.socket.emit('usuario conectado', usuario);
      }
    }
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

