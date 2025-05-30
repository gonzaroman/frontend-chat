import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-adminpanel',
  imports: [],
  templateUrl: './adminpanel.component.html',
  styleUrl: './adminpanel.component.css'
})
export class AdminPanelComponent implements OnInit {
  usuarios: any[] = [];
  salas: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarSalas();
  }

  cargarUsuarios() {
    this.http.get<any[]>('/api/admin/usuarios').subscribe(data => this.usuarios = data);
  }

  eliminarUsuario(nombre: string) {
    

    Swal.fire({
      title: " Eliminar Usuario: <br>" + nombre + " ",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Sala '" + nombre + "' eliminada!", "", "success");

         this.http.delete(`/api/admin/usuarios/${nombre}`).subscribe(() => this.cargarUsuarios());


      } else if (result.isDenied) {
        //  Swal.fire("No se ha eliminado", "", "info");
      }
    });



  }

  cargarSalas() {
    this.http.get<any[]>('/api/admin/salas').subscribe(data => this.salas = data);
  }

  eliminarSala(id: string) {
    //this.http.delete(`/api/admin/salas/${id}`).subscribe(() => this.cargarSalas());

    Swal.fire({
      title: "¿Quieres eliminar la Sala: <br>" + id + " ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Eliminar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Sala '" + id + "' eliminada!", "", "success");

         this.http.delete(`/api/admin/salas/${id}`).subscribe(() => this.cargarSalas());


      } else if (result.isDenied) {
        //  Swal.fire("No se ha eliminado", "", "info");
      }
    });



  }
}



