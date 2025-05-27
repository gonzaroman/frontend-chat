

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
  private onlineSubject = new BehaviorSubject<string[]>([]);
  online$ = this.onlineSubject.asObservable();

  constructor(
    private http: HttpClient,
    private socket: SocketService
  ) {
    this.socket.on<string[]>('lista usuarios')
      .pipe(tap(list => console.log('Recibido lista usuarios desde socket:', list)))
      .subscribe(list => this.onlineSubject.next(list));
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>('/api/usuarios')
      .pipe(tap(users => console.log('Usuarios desde API:', users)));
  }
}