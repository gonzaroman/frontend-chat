import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrivadoService, Conversacion } from '../../services/privado.service';

@Component({
  selector: 'app-privados-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './privados-list.component.html',
  styleUrls: ['./privados-list.component.css']
})
export class PrivadosListComponent implements OnInit {
  conversaciones: Conversacion[] = [];
  usuarioActual = '';
  private platformId = inject(PLATFORM_ID);
  private svc = inject(PrivadoService);

  ngOnInit() {
    
    if (isPlatformBrowser(this.platformId)) {
      this.usuarioActual = localStorage.getItem('usuario') || '';
      this.svc.obtenerConversaciones(this.usuarioActual)
        .subscribe(list => this.conversaciones = list);
    }
  }
}
