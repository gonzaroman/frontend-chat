// src/app/services/socket.service.ts
import { inject, Injectable, isDevMode, PLATFORM_ID } from '@angular/core';
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
      // Detectar el entorno
      const isDevelopment = window.location.hostname === 'localhost';
      const socketUrl = isDevelopment 
        ? 'http://localhost:3000' 
        : window.location.origin; // Usar el mismo origen en producción
      
      console.log('Conectando a Socket.IO en:', socketUrl);
      
      this.socket = io(socketUrl, {
        // Configuración mejorada para Render
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        forceNew: true
      });

      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        console.log('Conectando usuario:', usuario);
        // Esperar a que se establezca la conexión antes de emitir
        this.socket.on('connect', () => {
          console.log('✅ Conexión WebSocket establecida, ID:', this.socket?.id);
          this.socket?.emit('usuario conectado', usuario);
        });
      } else {
        this.socket.on('connect', () => {
          console.log('✅ Conexión WebSocket establecida, ID:', this.socket?.id);
        });
      }

      this.socket.on('connect_error', (err) => {
        console.error('❌ Error de conexión WebSocket:', err);
      });
      
      this.socket.on('disconnect', (reason) => {
        console.log('🔌 WebSocket desconectado, razón:', reason);
      });
      
      this.socket.on('lista usuarios', (list) => {
        console.log('📋 Recibido lista usuarios desde servidor:', list);
      });
    } else {
      console.log('SocketService: No inicializado en servidor (SSR)');
    }
  }

  emit(evento: string, data?: any) {
    if (isPlatformBrowser(this.platformId) && this.socket?.connected) {
      console.log(`📤 Emitiendo evento ${evento}:`, data);
      this.socket.emit(evento, data);
    } else if (isPlatformBrowser(this.platformId) && this.socket) {
      console.warn(`⚠️ Socket no conectado, esperando para emitir ${evento}`);
      this.socket.on('connect', () => {
        console.log(`📤 Emitiendo evento ${evento} tras reconexión:`, data);
        this.socket?.emit(evento, data);
      });
    }
  }

  on<T>(evento: string): Observable<T> {
    return new Observable<T>(observer => {
      if (isPlatformBrowser(this.platformId) && this.socket) {
        this.socket.on(evento, (payload: T) => {
          console.log(`📥 Evento ${evento} recibido:`, payload);
          observer.next(payload);
        });
        return () => this.socket?.off(evento);
      } else {
        console.log(`Evento ${evento} no suscrito en servidor (SSR)`);
        return () => {};
      }
    });
  }

  // Método para verificar el estado de conexión
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Método para forzar reconexión
  reconnect() {
    if (isPlatformBrowser(this.platformId) && this.socket) {
      this.socket.disconnect();
      this.socket.connect();
    }
  }
}