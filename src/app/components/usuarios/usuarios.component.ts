import { 
  Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, 
  ChangeDetectorRef, PLATFORM_ID 
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsuariosService, Usuario } from '../../services/usuarios.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimiza la detección de cambios
})
export class UsuariosComponent implements OnInit, OnDestroy {
  // Lista de todos los usuarios registrados
  usuarios: Usuario[] = [];

  // Lista de nombres de usuarios actualmente conectados
  onlineNombres: string[] = [];

  // Controla el estado de carga
  cargando = true;

  // Nombre del usuario actual (logueado)
  usuarioActual = '';

  // Observable para limpiar suscripciones al destruir el componente
  private destroy$ = new Subject<void>();

  // Inyecciones necesarias
  private usuariosSvc = inject(UsuariosService);     // Servicio que obtiene usuarios desde el backend
  private socketSvc   = inject(SocketService);       // Servicio de comunicación WebSocket
  private cdr         = inject(ChangeDetectorRef);   // Refrescar la vista manualmente
  private platformId  = inject(PLATFORM_ID);         // Para saber si se está ejecutando en el navegador

  ngOnInit() {
    // Solo ejecutamos esta lógica si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.usuarioActual = localStorage.getItem('usuario')?.trim() || '';
      
      if (this.usuarioActual) {
        // Emitimos al servidor que el usuario está conectado
        this.socketSvc.emit('usuario conectado', this.usuarioActual);
      }
    }

    // Obtenemos todos los usuarios registrados desde el servidor
    this.usuariosSvc.obtenerUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list) => {
          // Actualizamos la lista de usuarios y marcamos cuáles están online
          this.usuarios = list.map(u => ({
            ...u,
            online: this.onlineNombres.includes(u.nombre)
          }))
          .sort((a, b) => Number(b.online) - Number(a.online)); // Online primero

          this.cargando = false;
          this.cdr.markForCheck(); // Forzamos actualización de vista
        },
        error: (err) => {
          console.error('Error al cargar usuarios:', err);
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });

    // Escuchamos los cambios en la lista de usuarios conectados
    this.usuariosSvc.online$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list) => {
          this.onlineNombres = list;

          // Actualizamos el estado online en la lista de usuarios
          this.usuarios = this.usuarios.map(u => ({
            ...u,
            online: list.includes(u.nombre)
          }))
          .sort((a, b) => Number(b.online) - Number(a.online)); // Online primero

          this.cdr.markForCheck(); // Forzamos actualización
        },
        error: (err) => console.error('Error en online$:', err)
      });
  }

  // Al destruir el componente cancelamos las suscripciones
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Mejora el rendimiento del ngFor usando trackBy
  trackByNombre(index: number, usuario: Usuario): string {
    return usuario.nombre;
  }

  // Genera el ID de conversación privada entre dos usuarios (ordenados alfabéticamente)
  generarIdPrivado(a: string, b: string): string {
    return [a, b].sort().join('-');
  }
}
