// mis-salas.component.ts
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { RouterModule } from '@angular/router';
import { SalaService } from '../../services/salas.service';

@Component({
  selector: 'app-mis-salas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-salas.component.html',
  styleUrls: ['./mis-salas.component.css']
})
export class MisSalasComponent implements OnInit {
  salas: Array<{ id: string; nombre: string }> = [];
  cargando = true;
  usuario = '';
  salaService = inject(SalaService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.usuario = localStorage.getItem('usuario') || '';
      this.salaService.obtenerMisSalas(this.usuario)
        .subscribe(list => {
          this.salas = list;
          this.cargando = false;
        });
    }
  }

  eliminar(id: string) {
    if (!confirm('¿Eliminar esta sala?')) return;
    this.salaService.eliminarSala(id).subscribe(() => {
      this.salas = this.salas.filter(s => s.id !== id);
      alert('Sala eliminada');
    });
  }
}
