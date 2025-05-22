// src/app/components/chat-privado/chat-privado.component.ts
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
  @ViewChild('scrollPrivado', { static: false }) private scrollPrivado!: ElementRef<HTMLElement>;

  idPrivado = '';
  destino = '';
  usuarioActual = '';
  mensajes: Array<{ de: string; texto: string; fecha: Date }> = [];
  nuevoTexto = '';
  private platformId = inject(PLATFORM_ID);

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    // Sólo leer localStorage en navegador
    this.socketService.initSocket()
    if (isPlatformBrowser(this.platformId)) {
      this.usuarioActual = localStorage.getItem('usuario') || '';
    }

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;
      this.idPrivado = id;
      const [a, b] = this.idPrivado.split('-');
      this.destino = a === this.usuarioActual ? b : a;

      // Avisamos quién somos y nos unimos
      this.socketService.emit('usuario conectado', this.usuarioActual);
      this.socketService.emit('unirse a sala privada', this.idPrivado);

      // Historial
      this.socketService.on<any[]>('mensajes anteriores privados')
        .subscribe(list => {
          this.mensajes = list.map(m => ({
            de: m.usuario,
            texto: m.texto,
            fecha: m.fecha ? new Date(m.fecha) : new Date()
          }));
        });

      // Nuevos mensajes (evitamos eco)
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

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      const el = this.scrollPrivado.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {}
  }

  enviar() {
    const texto = this.nuevoTexto.trim();
    if (!texto) return;

    // Emitimos y luego mostramos localmente
    this.socketService.emit('mensaje privado', {
      sala: this.idPrivado,
      de: this.usuarioActual,
      para: this.destino,
      texto
    });

    this.mensajes.push({
  de: this.usuarioActual,
  texto,
  fecha: new Date()
});

    this.nuevoTexto = '';
  }
}
