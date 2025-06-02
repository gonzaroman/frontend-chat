import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

// Decorador del componente
@Component({
  selector: 'app-adminpanel',                           // Nombre del componente en HTML
  imports: [],                                           // No se han definido imports de otros módulos aquí
  templateUrl: './adminpanel.component.html',           // Ruta de la plantilla HTML
  styleUrl: './adminpanel.component.css'                // Ruta de los estilos
})
export class AdminPanelComponent implements OnInit {
  usuarios: any[] = []; // Lista de usuarios cargados desde el backend
  salas: any[] = [];    // Lista de salas cargadas desde el backend

  constructor(private http: HttpClient) {} // Inyección de HttpClient para hacer peticiones HTTP

  // Se ejecuta al iniciar el componente
  ngOnInit() {
    this.cargarUsuarios();  // Carga los usuarios
    this.cargarSalas();     // Carga las salas
  }

  // Método que obtiene todos los usuarios desde la API
  cargarUsuarios() {
    this.http.get<any[]>('/api/admin/usuarios').subscribe(data => this.usuarios = data);
  }

  // Método para eliminar un usuario
  eliminarUsuario(nombre: string) {
    // Cuadro de confirmación con SweetAlert
    Swal.fire({
      title: "Eliminar Usuario: <br>" + nombre + " ",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        // Mostrar mensaje de éxito
        Swal.fire("Sala '" + nombre + "' eliminada!", "", "success");
        // Llamar al backend para eliminar al usuario
        this.http.delete(`/api/admin/usuarios/${nombre}`).subscribe(() => this.cargarUsuarios());
      }
      // Si se cancela, no se hace nada
    });
  }

  // Método que obtiene todas las salas desde la API
  cargarSalas() {
    this.http.get<any[]>('/api/admin/salas').subscribe(data => this.salas = data);
  }

  // Método para eliminar una sala
  eliminarSala(id: string) {
    // Cuadro de confirmación
    Swal.fire({
      title: "¿Quieres eliminar la Sala: <br>" + id + " ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Sala '" + id + "' eliminada!", "", "success");
        // Llamada al backend para eliminar la sala y recargar la lista
        this.http.delete(`/api/admin/salas/${id}`).subscribe(() => this.cargarSalas());
      }
    });
  }
}
