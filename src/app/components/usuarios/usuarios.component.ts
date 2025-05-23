// src/app/components/usuarios/usuarios.component.ts
// import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { UsuariosService, Usuario } from '../../services/usuarios.service';
// import { SocketService } from '../../services/socket.service';

// @Component({
//   selector: 'app-usuarios',
//   standalone: true,
//   imports: [CommonModule, RouterModule],  // <-- necesitamos RouterModule
//   templateUrl: './usuarios.component.html',
//   styleUrls: ['./usuarios.component.css']
// })
// export class UsuariosComponent implements OnInit {
//   usuarios: Usuario[] = [];
//   onlineNombres: string[] = [];
//   cargando = true;
//   usuarioActual = '';

//   private usuariosSvc = inject(UsuariosService);
//   private socketSvc   = inject(SocketService);
//   private platformId  = inject(PLATFORM_ID);

//   ngOnInit() {
//     // 1) Leer tu usuario una sola vez
//     if (isPlatformBrowser(this.platformId)) {
//       this.usuarioActual = localStorage.getItem('usuario')?.trim() || '';
//       if (this.usuarioActual) {
//         this.socketSvc.emit('usuario conectado', this.usuarioActual);
//       }
//     }

//     // 2) Cargar listado de todos los usuarios
//     this.usuariosSvc.obtenerUsuarios()
//       .subscribe(list => {
//         this.usuarios = list;
//         this.cargando = false;
//       });

//     // 3) Suscribirnos al flujo de “online” desde el socket
//     this.usuariosSvc.online$
//       .subscribe(list => {
//         this.onlineNombres = list;
//       });
//   }

//   /** Ordena alfabéticamente y une con guión para generar el ID único */
//   generarIdPrivado(a: string, b: string): string {
//     return [a, b].sort().join('-');
//   }
// }

// src/app/components/usuarios/usuarios.component.ts
// src/app/components/usuarios/usuarios.component.ts
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
  template: `
    <div *ngIf="cargando">Cargando...</div>
    <ul *ngIf="!cargando">
      <li *ngFor="let usuario of usuarios; trackBy: trackByNombre">
        {{ usuario.nombre }} - {{ usuario.online ? 'Online' : 'Offline' }}
        <a *ngIf="usuario.nombre !== usuarioActual" [routerLink]="['/privado', generarIdPrivado(usuarioActual, usuario.nombre)]">Chat privado</a>
      </li>
    </ul>
  `,
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
    console.log('UsuariosComponent: Iniciando');
    if (isPlatformBrowser(this.platformId)) {
      this.usuarioActual = localStorage.getItem('usuario')?.trim() || '';
      if (this.usuarioActual) {
        console.log('Emitiendo usuario conectado:', this.usuarioActual);
        this.socketSvc.emit('usuario conectado', this.usuarioActual);
      }
    }

    this.usuariosSvc.obtenerUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list) => {
          console.log('Usuarios recibidos:', list);
          this.usuarios = list.map(u => ({
            ...u,
            online: this.onlineNombres.includes(u.nombre)
          }));
          this.cargando = false;
          this.cdr.markForCheck();
          console.log('cargando puesto a false');
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
          console.log('Usuarios online:', list);
          this.onlineNombres = list;
          this.usuarios = this.usuarios.map(u => ({
            ...u,
            online: list.includes(u.nombre)
          }));
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