
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | undefined;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.socket = io('http://localhost:3000', {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      const usuario = localStorage.getItem('usuario');
      if (usuario) {
       // console.log('Conectando usuario:', usuario);
        this.socket.emit('usuario conectado', usuario);
      }

      this.socket.on('connect', () => {
       // console.log('Conexión WebSocket establecida');
      });
      this.socket.on('connect_error', (err) => {
       // console.error('Error de conexión WebSocket:', err);
      });
      this.socket.on('lista usuarios', (list) => {
        //console.log('Recibido lista usuarios desde servidor:', list);
      });
    } else {
      console.log('SocketService: No inicializado en servidor (SSR)');
    }
  }

  emit(evento: string, data?: any) {
    if (isPlatformBrowser(this.platformId) && this.socket) {
      //console.log(`Emitiendo evento ${evento}:`, data);
      this.socket.emit(evento, data);
    }
  }

  on<T>(evento: string): Observable<T> {
    return new Observable<T>(observer => {
      if (isPlatformBrowser(this.platformId) && this.socket) {
        this.socket.on(evento, (payload: T) => {
         // console.log(`Evento ${evento} recibido:`, payload);
          observer.next(payload);
        });
        return () => this.socket?.off(evento);
      } else {
        console.log(`Evento ${evento} no suscrito en servidor (SSR)`);
        return () => {};
      }
    });
  }
}