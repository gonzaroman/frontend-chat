import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-chat-sala',
  standalone: true,
  imports: [FormsModule, CommonModule],  // para ngModel
  templateUrl: './chat-sala.component.html',
  styleUrls: ['./chat-sala.component.css']
})
export class ChatSalaComponent implements OnInit {
  idSala = '';
  mensajes: Array<{ usuario: string; texto: string; fecha?: string }> = [];
  nuevoMensaje = '';
  usuarioActual = '';
  // Esto nos permite saber si estamos en el navegador
private platformId = inject(PLATFORM_ID);

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService
  ) {}

  ngOnInit() {

    // Leer el usuario actual una sola vez
   

    if (isPlatformBrowser(this.platformId)) {
      this.usuarioActual = localStorage.getItem('usuario') || '';
    }

    // Obtener ID de sala y suscribirse a mensajes

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;
      this.idSala = id;

      // 1) Unirse a la sala
      this.socketService.emit('unirse a sala', this.idSala);

      // 2) Cargar mensajes anteriores
      this.socketService.on<any[]>('mensajes anteriores')
        .subscribe(ms => this.mensajes = ms);

      // 3) Escuchar mensajes nuevos
      this.socketService.on<any>('mensaje del chat')
        .subscribe(m => this.mensajes.push(m));
    });
  }

  enviarMensaje() {
    const texto = this.nuevoMensaje.trim();
    if (!texto) return;

    const usuario = localStorage.getItem('usuario') || 'Anon';
    const mensaje = { usuario, texto, sala: this.idSala };

    

    this.socketService.emit('mensaje del chat', mensaje);
    this.nuevoMensaje = '';
  }
}
