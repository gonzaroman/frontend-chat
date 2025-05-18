import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SalaService } from '../../services/salas.service';

@Component({
  selector: 'app-salas-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './salas-list.component.html',
  styleUrl: './salas-list.component.css'
})
export class SalasListComponent implements OnInit {
  salas: Array<{ id: string; nombre: string; creador: string }> = [];

  constructor(private salaService: SalaService) {}

  ngOnInit() {
    this.salaService.obtenerSalas()
      .subscribe(list => this.salas = list);
  }
}