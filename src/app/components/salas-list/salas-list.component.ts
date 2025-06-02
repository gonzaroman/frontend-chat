// Importación de módulos necesarios
import { CommonModule } from '@angular/common';  // Para directivas comunes como *ngIf, *ngFor
import { Component, OnInit } from '@angular/core';  // Decorador y hook de ciclo de vida
import { RouterModule } from '@angular/router';     // Para utilizar [routerLink] en la vista
import { SalaService } from '../../services/salas.service'; // Servicio para interactuar con la API de salas

// Decorador del componente
@Component({
  selector: 'app-salas-list',                     // Nombre del selector para usar este componente
  imports: [CommonModule, RouterModule],          // Módulos que se importan en el componente
  templateUrl: './salas-list.component.html',     // Plantilla HTML
  styleUrl: './salas-list.component.css'          // Hoja de estilos CSS asociada
})
export class SalasListComponent implements OnInit {
  // Array que almacenará la lista de salas públicas
  salas: Array<{ id: string; nombre: string; creador: string }> = [];

  // Inyectamos el servicio de salas en el constructor
  constructor(private salaService: SalaService) {}

  // Hook que se ejecuta al iniciar el componente
  ngOnInit() {
    // Llamamos al servicio para obtener las salas desde el backend
    this.salaService.obtenerSalas()
      .subscribe(list => this.salas = list); // Asignamos la respuesta a la variable salas
  }
}
