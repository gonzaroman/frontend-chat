// src/app/components/chat-sala/chat-sala.component.ts
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-chat-sala',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './chat-sala.component.html',
  styleUrls: ['./chat-sala.component.css']
})
export class ChatSalaComponent implements OnInit {
  idSala = '';
  mensajes: Array<{ usuario: string; texto: string; fecha: Date }> = [];
  nuevoMensaje = '';
  usuarioActual = '';
  usuariosConectados: string[] = [];
  private platformId = inject(PLATFORM_ID);

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    // 1) Leer usuarioActual en navegador
    if (isPlatformBrowser(this.platformId)) {
      this.usuarioActual = (localStorage.getItem('usuario') || '').trim();
    }

    // 2) Avisar al servidor de quién es este socket
    this.socketService.emit('usuario conectado', this.usuarioActual);

    // 3) Suscribirse a nuevos mensajes UNA SOLA VEZ
    this.socketService
      .on<{ usuario: string; texto: string; fecha?: any }>('mensaje del chat')
      .subscribe(m => {
        const fechaParsed = m.fecha ? new Date(m.fecha) : new Date();
        this.mensajes.push({
          usuario: String(m.usuario).trim(),
          texto: m.texto,
          fecha: fechaParsed
        });
      });

    // 4) Suscribirse a lista de usuarios en sala UNA SOLA VEZ
    this.socketService
      .on<string[]>('usuarios en sala')
      .subscribe(list => (this.usuariosConectados = list));

    // 5) Cada vez que cambie la ruta con el id de sala:
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;
      this.idSala = id;

      // A) Unirse a esa sala
      this.socketService.emit('unirse a sala', this.idSala);

      // B) Cargar historial de mensajes
      this.socketService
        .on<any[]>('mensajes anteriores')
        .subscribe(ms => {
          this.mensajes = ms.map(m => {
            const fechaParsed = m.fecha ? new Date(m.fecha) : new Date();
            return {
              usuario: String(m.usuario).trim(),
              texto: m.texto,
              fecha: fechaParsed
            };
          });
        });
    });
  }

  generarIdPrivado(a: string, b: string): string {
    return [a, b].sort().join('-');
  }

  enviarMensaje() {
    const texto = this.nuevoMensaje.trim();
    if (!texto) return;

    const usuario = isPlatformBrowser(this.platformId)
      ? (localStorage.getItem('usuario') || 'Anon').trim()
      : 'Anon';

    this.socketService.emit('mensaje del chat', {
      usuario,
      texto,
      sala: this.idSala
    });

    this.nuevoMensaje = '';
  }
}
