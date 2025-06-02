import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root' // Hace que este servicio esté disponible globalmente en la app
})
export class SocketService {
  private socket: Socket | undefined; // Instancia del socket
  private platformId = inject(PLATFORM_ID); // Detecta si se ejecuta en el navegador

  constructor() {
    // Solo inicializar Socket.IO si estamos en el navegador (no en SSR)
    if (isPlatformBrowser(this.platformId)) {
      // Conectar al servidor de WebSocket (local en desarrollo)
      this.socket = io('http://localhost:3000', {
        reconnection: true,              // Reintentar reconexión si se pierde
        reconnectionAttempts: 5,         // Máximo 5 intentos
        reconnectionDelay: 1000          // Esperar 1s entre intentos
      });

      // Si el usuario ya está en localStorage, se notifica al servidor que se ha conectado
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        this.socket.emit('usuario conectado', usuario);
      }

      // Cuando la conexión WebSocket se establece correctamente
      this.socket.on('connect', () => {
        // console.log('Conexión WebSocket establecida');
      });

      // Si ocurre un error de conexión
      this.socket.on('connect_error', (err) => {
        // console.error('Error de conexión WebSocket:', err);
      });

      // Maneja el evento que informa de los usuarios conectados
      this.socket.on('lista usuarios', (list) => {
        // console.log('Recibido lista usuarios desde servidor:', list);
      });
    } else {
      // Para entornos tipo SSR (server-side rendering) como Angular Universal
      console.log('SocketService: No inicializado en servidor (SSR)');
    }
  }

  /**
   * Emite un evento por WebSocket al servidor con datos opcionales
   * @param evento Nombre del evento a emitir (por ejemplo: 'mensaje del chat')
   * @param data Datos que se envían junto con el evento
   */
  emit(evento: string, data?: any) {
    if (isPlatformBrowser(this.platformId) && this.socket) {
      this.socket.emit(evento, data);
    }
  }

  /**
   * Escucha un evento emitido por el servidor y devuelve los datos como un Observable
   * @param evento Nombre del evento a escuchar (por ejemplo: 'mensaje privado')
   * @returns Observable con los datos emitidos por el servidor
   */
  on<T>(evento: string): Observable<T> {
    return new Observable<T>(observer => {
      if (isPlatformBrowser(this.platformId) && this.socket) {
        this.socket.on(evento, (payload: T) => {
          observer.next(payload); // Emite el dato recibido
        });

        // Limpia el listener cuando se destruye el Observable
        return () => this.socket?.off(evento);
      } else {
        console.log(`Evento ${evento} no suscrito en servidor (SSR)`);
        return () => {};
      }
    });
  }
}
