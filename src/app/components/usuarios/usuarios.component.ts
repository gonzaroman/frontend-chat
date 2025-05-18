// src/app/components/usuarios/usuarios.component.ts
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UsuariosService, Usuario } from '../../services/usuarios.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  onlineNombres: string[] = [];
  cargando = true;

  private usuariosSvc = inject(UsuariosService);
  private socketSvc   = inject(SocketService);
  private platformId  = inject(PLATFORM_ID);

  ngOnInit() {
    // 1) Si estamos en navegador, decimos quién estamos
    if (isPlatformBrowser(this.platformId)) {
      const yo = localStorage.getItem('usuario')?.trim();
      if (yo) {
        this.socketSvc.emit('usuario conectado', yo);
      }
    }

    // 2) Cargar listado estático
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
}
