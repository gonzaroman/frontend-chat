

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SocketService } from './socket.service';

// Interfaz para representar un usuario con su estado
export interface Usuario {
  nombre: string;
  online: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  // Subject para guardar y emitir los usuarios online en tiempo real
  private onlineSubject = new BehaviorSubject<string[]>([]);
  // Observable expuesto para que los componentes puedan suscribirse
  online$ = this.onlineSubject.asObservable();

  constructor(
    private http: HttpClient,           // Cliente HTTP para hacer peticiones a la API
    private socket: SocketService       // Servicio de WebSocket para recibir eventos en tiempo real
  ) {
    // Escuchamos los eventos 'lista usuarios' que emite el servidor por WebSocket
    this.socket.on<string[]>('lista usuarios')
      // Cada vez que llega una nueva lista de usuarios conectados, la actualizamos
      .subscribe(list => this.onlineSubject.next(list));
  }

  /**
   * Método para obtener todos los usuarios registrados desde el backend
   * Devuelve un Observable con un array de usuarios
   */
  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>('/api/usuarios');
  }
}
