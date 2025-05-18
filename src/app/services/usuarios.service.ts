// src/app/services/usuarios.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SocketService } from './socket.service';

export interface Usuario {
  nombre: string;
  online: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  // estado online en tiempo real
  private onlineSubject = new BehaviorSubject<string[]>([]);
  online$ = this.onlineSubject.asObservable();

  constructor(
    private http: HttpClient,
    private socket: SocketService
  ) {
    // cada vez que el servidor emite lista usuarios, actualiza
    this.socket.on<string[]>('lista usuarios')
      .subscribe(list => this.onlineSubject.next(list));
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>('/api/usuarios');
  }
}
