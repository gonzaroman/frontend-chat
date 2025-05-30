
import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsuariosComponent implements OnInit, OnDestroy {
  usuarios: Usuario[] = [];
  onlineNombres: string[] = [];
  cargando = true;
  usuarioActual = '';
  private destroy$ = new Subject<void>();

  private usuariosSvc = inject(UsuariosService);
  private socketSvc = inject(SocketService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    //console.log('UsuariosComponent: Iniciando');
    if (isPlatformBrowser(this.platformId)) {
      this.usuarioActual = localStorage.getItem('usuario')?.trim() || '';
      if (this.usuarioActual) {
        //console.log('Emitiendo usuario conectado:', this.usuarioActual);
        this.socketSvc.emit('usuario conectado', this.usuarioActual);
      }
    }

    this.usuariosSvc.obtenerUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list) => {
         // console.log('Usuarios recibidos:', list);
          this.usuarios = list.map(u => ({
            ...u,
            online: this.onlineNombres.includes(u.nombre)
          }))
          .sort((a, b) => Number(b.online) - Number(a.online));
          this.cargando = false;
          this.cdr.markForCheck();
         // console.log('cargando puesto a false');
        },
        error: (err) => {
          console.error('Error al cargar usuarios:', err);
          this.cargando = false;
          this.cdr.markForCheck();
         console.log('cargando puesto a false (error)');
        }
      });

    this.usuariosSvc.online$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list) => {
       //   console.log('Usuarios online:', list);
          this.onlineNombres = list;
          this.usuarios = this.usuarios.map(u => ({
            ...u,
            online: list.includes(u.nombre)
          }))
          .sort((a, b) => Number(b.online) - Number(a.online));
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Error en online$:', err)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByNombre(index: number, usuario: Usuario): string {
    return usuario.nombre;
  }

  generarIdPrivado(a: string, b: string): string {
    return [a, b].sort().join('-');
  }
}