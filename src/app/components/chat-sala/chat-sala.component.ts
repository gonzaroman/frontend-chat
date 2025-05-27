// src/app/components/chat-sala/chat-sala.component.ts
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
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLElement>;

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
   /* if (isPlatformBrowser(this.platformId)) {
      this.usuarioActual = (localStorage.getItem('usuario') || '').trim();
    }*/

      if (typeof window !== 'undefined' && window.localStorage) {
    this.usuarioActual = window.localStorage.getItem('usuario')?.trim() || '';
  }





    this.socketService.emit('usuario conectado', this.usuarioActual);




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

    this.socketService
      .on<string[]>('usuarios en sala')
      .subscribe(list => (this.usuariosConectados = list));

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;
      this.idSala = id;

      this.socketService.emit('unirse a sala', this.idSala);

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

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {}
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
