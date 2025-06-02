// mis-salas.component.ts
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { RouterModule } from '@angular/router';
import { SalaService } from '../../services/salas.service';

import Swal from 'sweetalert2'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-salas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mis-salas.component.html',
  styleUrls: ['./mis-salas.component.css']
})
export class MisSalasComponent implements OnInit {
   // Lista de salas del usuario (ahora con campos para editar)
  salas: Array<{ id: string; nombre: string; editando: boolean; nuevoNombre: string }> = [];

  cargando = true;        // Indicador de carga
  usuario = '';           // Nombre del usuario actual
  salaService = inject(SalaService); // Inyectamos el servicio de salas
  private platformId = inject(PLATFORM_ID); // Detectar si estamos en navegador o servidor



    ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.usuario = localStorage.getItem('usuario') || '';
      this.salaService.obtenerMisSalas(this.usuario)
        .subscribe(list => {
          // Añadimos propiedades necesarias para la edición
          this.salas = list.map(s => ({
            ...s,
            editando: false,          // Indica si está en modo edición
            nuevoNombre: s.nombre     // Almacena el nuevo nombre temporalmente
          }));
          this.cargando = false;
        });
    }
  }


    eliminar(id: string, nombreSala: string) {
    Swal.fire({
      title: "¿Quieres eliminar la Sala: <br>" + nombreSala + " ?",
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Sala '" + nombreSala + "' eliminada!", "", "success");

        this.salaService.eliminarSala(id).subscribe(() => {
          this.salas = this.salas.filter(s => s.id !== id); // Eliminamos la sala localmente
        });
      }
    });
  }


   editar(sala: any) {
    sala.editando = true;                // Activa modo edición
    sala.nuevoNombre = sala.nombre;      // Copia el nombre actual
  }

  guardar(sala: any) {
    const nombreLimpio = sala.nuevoNombre.trim();
    if (!nombreLimpio || nombreLimpio.length > 50) return;

    // Llama a la API para actualizar
    this.salaService.actualizarSalaNombre(sala.id, nombreLimpio)
      .subscribe(() => {
        sala.nombre = nombreLimpio;     // Actualiza localmente
        sala.editando = false;          // Sale del modo edición
      });
  }

  cancelar(sala: any) {
    sala.editando = false;              // Cancela edición sin guardar
  }
}

