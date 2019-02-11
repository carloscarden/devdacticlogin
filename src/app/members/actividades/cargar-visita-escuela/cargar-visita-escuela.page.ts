import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TodoService } from './../../../services/todo.service';

@Component({
  selector: 'app-cargar-visita-escuela',
  templateUrl: './cargar-visita-escuela.page.html',
  styleUrls: ['./cargar-visita-escuela.page.scss'],
})
export class CargarVisitaEscuelaPage implements OnInit {
  inspeccion = {}
  constructor(private route: ActivatedRoute,private location: Location,private todoService: TodoService) { }

  ngOnInit() {
  }

  logForm() {
    console.log(this.inspeccion);
  }

  uploadFile() {
   console.log("uploadFile");
  }

  goBack(): void {
    this.location.back();
  }

}
