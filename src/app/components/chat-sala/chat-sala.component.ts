import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-chat-sala',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-sala.component.html',
  styleUrls: ['./chat-sala.component.css']
})
export class ChatSalaComponent implements OnInit {
  idSala = '';
  mensajes: Array<{ usuario: string; texto: string; fecha?: string }> = [];
  nuevoMensaje = '';
  usuarioActual = '';
  usuariosConectados: string[] = [];

  private platformId = inject(PLATFORM_ID);

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    // Leer el usuario actual en navegador
    if (isPlatformBrowser(this.platformId)) {
      this.usuarioActual = localStorage.getItem('usuario') || '';
    }

    // 2) Emitimos YA el nombre al conectar el socket
  this.socketService.emit('usuario conectado', this.usuarioActual);

    // Esperar al parámetro 'id' de la ruta
    this.route.paramMap.subscribe(params => {
      console.log('unirme a sala:', this.idSala);
      const id = params.get('id');
      if (!id) return;
      this.idSala = id;

      // 1) Suscribirse a la lista de usuarios ANTES de emitir
      this.socketService.on<string[]>('usuarios en sala')
        .subscribe(lista => {
          console.log('evento usuarios en sala:', lista);
          this.usuariosConectados = lista;
        });

      // 1) Avisamos al servidor quién es este socket
  

  // 2) Ahora sí nos unimos a la sala
  this.socketService.emit('unirse a sala', this.idSala);

      // 3) Cargar mensajes anteriores
      this.socketService.on<any[]>('mensajes anteriores')
        .subscribe(ms => this.mensajes = ms);

      // 4) Escuchar mensajes nuevos
      this.socketService.on<any>('mensaje del chat')
        .subscribe(m => this.mensajes.push(m));
    });
  }

  enviarMensaje() {
    const texto = this.nuevoMensaje.trim();
    if (!texto) return;

    const usuario = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('usuario') || 'Anon'
      : 'Anon';

    const mensaje = { usuario, texto, sala: this.idSala };

    this.socketService.emit('mensaje del chat', mensaje);
    this.nuevoMensaje = '';
  }
}
