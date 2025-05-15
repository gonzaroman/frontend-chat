import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-chat-privado',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './chat-privado.component.html',
  styleUrls: ['./chat-privado.component.css']
})
export class ChatPrivadoComponent implements OnInit {
  idPrivado = '';
  destino = '';
  usuarioActual = '';
  mensajes: Array<{ de: string; texto: string; fecha: Date }> = [];
  nuevoTexto = '';
  private platformId = inject(PLATFORM_ID);

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    // 1) Leer usuario actual desde localStorage
    if (isPlatformBrowser(this.platformId)) {
      this.usuarioActual = localStorage.getItem('usuario') || '';
    }

    // 2) Subscribir al parámetro de ruta
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;
      this.idPrivado = id;

      // 3) Determinar el otro participante
      const [a, b] = this.idPrivado.split('-');
      this.destino = (a === this.usuarioActual ? b : a);

      // 4) Avisar al servidor de nuestro nombre
      this.socketService.emit('usuario conectado', this.usuarioActual);

      // 5) Unirse a la sala privada
      this.socketService.emit('unirse a sala privada', this.idPrivado);

      // 6) Cargar historial privado
      this.socketService.on<any[]>('mensajes anteriores privados')
        .subscribe(list => {
          this.mensajes = list.map(m => ({
            de: m.usuario,
            texto: m.texto,
            fecha: new Date(m.fecha)
          }));
        });

      // 7) Escuchar nuevos privados
      this.socketService.on<{ de: string; texto: string }>('mensaje privado')
        .subscribe(m => {
          this.mensajes.push({ de: m.de, texto: m.texto, fecha: new Date() });
        });
    });
  }

/**  
 * Dado el usuario actual y otro, devuelve siempre el mismo orden  
 * para que la sala privada coincida.  
 * Ejemplo: ordenar alfabéticamente “alice” y “bob” → “alice-bob”  
 */
generarIdPrivado(a: string, b: string): string {
  return [a, b].sort().join('-');
}


  enviar() {
    const texto = this.nuevoTexto.trim();
    if (!texto) return;

    // 8) Construir y enviar
    this.socketService.emit('mensaje privado', {
      sala: this.idPrivado,
      de: this.usuarioActual,
      para: this.destino,
      texto
    });

    // 9) Mostrar inmediatamente en UI
    this.mensajes.push({ de: 'Tú', texto, fecha: new Date() });
    this.nuevoTexto = '';
  }
}
