// Importaciones necesarias desde Angular
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

// Importamos el servicio que gestiona las conversaciones privadas
import { PrivadoService, Conversacion } from '../../services/privado.service';


@Component({
  selector: 'app-privados-list',           
  standalone: true,                        
  imports: [CommonModule, RouterModule],   
  templateUrl: './privados-list.component.html',  
  styleUrls: ['./privados-list.component.css']    
})
export class PrivadosListComponent implements OnInit {
  // Lista donde se almacenarán las conversaciones privadas del usuario
  conversaciones: Conversacion[] = [];

  // Usuario actual obtenido del almacenamiento local
  usuarioActual = '';

  // Para detectar si estamos en el navegador (no en servidor SSR)
  private platformId = inject(PLATFORM_ID);

  // Inyectamos el servicio que gestiona los mensajes privados
  private svc = inject(PrivadoService);

  // Hook de ciclo de vida que se ejecuta al iniciar el componente
  ngOnInit() {
    // Solo se ejecuta en el navegador para evitar errores en Angular Universal (SSR)
    if (isPlatformBrowser(this.platformId)) {
      // Obtenemos el nombre del usuario guardado en localStorage
      this.usuarioActual = localStorage.getItem('usuario') || '';

      // Llamamos al servicio para obtener las conversaciones del usuario
      this.svc.obtenerConversaciones(this.usuarioActual)
        .subscribe(list => this.conversaciones = list); // Guardamos el resultado en el array
    }
  }
}
