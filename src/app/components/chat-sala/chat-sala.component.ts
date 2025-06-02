// Importaciones esenciales de Angular y otras librerías necesarias
import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, inject, PLATFORM_ID } from '@angular/core';
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
export class ChatSalaComponent implements OnInit, AfterViewChecked {
  // Referencia al contenedor del chat para hacer scroll automático
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLElement>;

  // Variables de estado
  idSala = ''; // ID de la sala (viene por la URL)
  mensajes: Array<{ usuario: string; texto: string; fecha: Date }> = []; // Lista de mensajes
  nuevoMensaje = '';  // Texto del nuevo mensaje a enviar
  usuarioActual = ''; // Nombre del usuario actual (sacado del localStorage)
  usuariosConectados: string[] = []; // Lista de usuarios conectados en esta sala
  private platformId = inject(PLATFORM_ID); // Detectar si estamos en navegador

  constructor(
    private route: ActivatedRoute,             // Para acceder a los parámetros de la ruta (/sala/:id)
    private socketService: SocketService       // Servicio de WebSocket
  ) {}

  ngOnInit() {
    // Obtener usuario del localStorage (sólo si estamos en navegador)
    if (typeof window !== 'undefined' && window.localStorage) {
      this.usuarioActual = window.localStorage.getItem('usuario')?.trim() || '';
    }

    // Emitir evento de usuario conectado (se usa para saber quién está online)
    this.socketService.emit('usuario conectado', this.usuarioActual);

    // Suscribirse a los mensajes que lleguen del servidor en tiempo real
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

    // Suscribirse a la lista de usuarios conectados en la sala
    this.socketService
      .on<string[]>('usuarios en sala')
      .subscribe(list => (this.usuariosConectados = list));

    // Detectar cambios en la ruta (cuando entras a una sala diferente)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;

      this.idSala = id;

      // Unirse a la sala especificada
      this.socketService.emit('unirse a sala', this.idSala);

      // Cargar mensajes anteriores de la sala
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

  // Scroll automático hacia abajo cada vez que se actualiza la vista
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  // Método que mueve el scroll al final del contenedor
  private scrollToBottom(): void {
    try {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {}
  }

  // Generar ID único para conversaciones privadas entre dos usuarios (ordenados alfabéticamente)
  generarIdPrivado(a: string, b: string): string {
    return [a, b].sort().join('-');
  }

  // Enviar mensaje al servidor (y a todos los usuarios en la sala)
  enviarMensaje() {
    const texto = this.nuevoMensaje.trim();
    if (!texto) return;

    const usuario = isPlatformBrowser(this.platformId)
      ? (localStorage.getItem('usuario') || 'Anon').trim()
      : 'Anon';

    // Emitir el mensaje al servidor usando Socket.IO
    this.socketService.emit('mensaje del chat', {
      usuario,
      texto,
      sala: this.idSala
    });

    // Limpiar el campo de entrada
    this.nuevoMensaje = '';
  }
}
