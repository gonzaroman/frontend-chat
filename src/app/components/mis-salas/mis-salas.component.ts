// mis-salas.component.ts
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { RouterModule } from '@angular/router';
import { SalaService } from '../../services/salas.service';

import Swal from 'sweetalert2'

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

  eliminar(id: string, nombreSala: string) {

    /* if (!confirm('¿Eliminar esta sala?')) return;
     this.salaService.eliminarSala(id).subscribe(() => {
       this.salas = this.salas.filter(s => s.id !== id);
       alert('Sala eliminada');
     });*/

    Swal.fire({
      title: "¿Quieres eliminar la Sala: <br>" + nombreSala + " ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Sala '" + nombreSala + "' eliminada!", "", "success");

        this.salaService.eliminarSala(id).subscribe(() => {
          this.salas = this.salas.filter(s => s.id !== id);
          // alert('Sala eliminada');
        });


      } else if (result.isDenied) {
        //  Swal.fire("No se ha eliminado", "", "info");
      }
    });




  }



}
