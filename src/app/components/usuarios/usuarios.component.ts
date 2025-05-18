// src/app/components/usuarios/usuarios.component.ts
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuariosService, Usuario } from '../../services/usuarios.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule],  // <-- necesitamos RouterModule
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  onlineNombres: string[] = [];
  cargando = true;
  usuarioActual = '';

  private usuariosSvc = inject(UsuariosService);
  private socketSvc   = inject(SocketService);
  private platformId  = inject(PLATFORM_ID);

  ngOnInit() {
    // 1) Leer tu usuario una sola vez
    if (isPlatformBrowser(this.platformId)) {
      this.usuarioActual = localStorage.getItem('usuario')?.trim() || '';
      if (this.usuarioActual) {
        this.socketSvc.emit('usuario conectado', this.usuarioActual);
      }
    }

    // 2) Cargar listado de todos los usuarios
    this.usuariosSvc.obtenerUsuarios()
      .subscribe(list => {
        this.usuarios = list;
        this.cargando = false;
      });

    // 3) Suscribirnos al flujo de “online” desde el socket
    this.usuariosSvc.online$
      .subscribe(list => {
        this.onlineNombres = list;
      });
  }

  /** Ordena alfabéticamente y une con guión para generar el ID único */
  generarIdPrivado(a: string, b: string): string {
    return [a, b].sort().join('-');
  }
}
