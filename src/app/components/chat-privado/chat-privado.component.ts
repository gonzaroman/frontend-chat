
import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SocketService } from '../../services/socket.service';
import { PrivadosListComponent } from "../privados-list/privados-list.component";

@Component({
  selector: 'app-chat-privado',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, PrivadosListComponent],
  templateUrl: './chat-privado.component.html',
  styleUrls: ['./chat-privado.component.css']
})
export class ChatPrivadoComponent implements OnInit, AfterViewChecked {
  // Referencia al contenedor para hacer scroll automático al final del chat
  @ViewChild('scrollPrivado', { static: false }) private scrollPrivado!: ElementRef<HTMLElement>;

  // Variables para controlar la sala privada y los mensajes
  idPrivado = '';        // ID único de la conversación privada (ej. 'gonza-ramiro')
  destino = '';          // Usuario con el que se está hablando
  usuarioActual = '';    // Usuario logueado
  mensajes: Array<{ de: string; texto: string; fecha: Date }> = []; // Lista de mensajes
  nuevoTexto = '';       // Texto a enviar
  private platformId = inject(PLATFORM_ID); // Para comprobar si está en navegador 

  constructor(
    private route: ActivatedRoute,               // Para obtener el parámetro de la ruta (id de la sala)
    private socketService: SocketService         // Servicio que gestiona los WebSocket
  ) {}

  ngOnInit() {
    // Leer el usuario actual del localStorage si estamos en navegador
    if (isPlatformBrowser(this.platformId)) {
      this.usuarioActual = localStorage.getItem('usuario') || '';
    }

    // Cuando cambia el parámetro de la ruta (al entrar a una conversación)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;
      this.idPrivado = id;

      // Determinar con quién se habla (extrae nombre opuesto del ID)
      const [a, b] = this.idPrivado.split('-');
      this.destino = a === this.usuarioActual ? b : a;

      // Unirse a la sala privada y enviar nombre
      this.socketService.emit('usuario conectado', this.usuarioActual);
      this.socketService.emit('unirse a sala privada', this.idPrivado);

      // Cargar historial de mensajes antiguos desde el servidor
      this.socketService.on<any[]>('mensajes anteriores privados')
        .subscribe(list => {
          this.mensajes = list.map(m => ({
            de: m.usuario,
            texto: m.texto,
            fecha: m.fecha ? new Date(m.fecha) : new Date()
          }));
        });

      // Escuchar mensajes nuevos del servidor (sólo si son del otro usuario)
      this.socketService
        .on<{ de: string; texto: string; fecha?: any }>('mensaje privado')
        .subscribe(m => {
          if (m.de.trim() !== this.usuarioActual) {
            this.mensajes.push({
              de: m.de.trim(),
              texto: m.texto,
              fecha: m.fecha ? new Date(m.fecha) : new Date()
            });
          }
        });
    });
  }

  // Después de cada actualización visual, hace scroll automático al final del chat
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  // Método que mueve el scroll hacia abajo del contenedor
  private scrollToBottom(): void {
    try {
      const el = this.scrollPrivado.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {}
  }

  // Método que se llama al pulsar "Enviar"
  enviar() {
    const texto = this.nuevoTexto.trim();
    if (!texto) return;

    // Enviar el mensaje al servidor vía WebSocket
    this.socketService.emit('mensaje privado', {
      sala: this.idPrivado,
      de: this.usuarioActual,
      para: this.destino,
      texto
    });

    // Añadir el mensaje localmente (aparece sin esperar respuesta)
    this.mensajes.push({
      de: this.usuarioActual,
      texto,
      fecha: new Date()
    });

    // Limpiar el campo de entrada
    this.nuevoTexto = '';
  }
}
