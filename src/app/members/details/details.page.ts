import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Inspeccion } from './../../_models/inspeccion';
import { TodoService } from './../../services/todo.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  inspeccion: Inspeccion;

  constructor(private route: ActivatedRoute,private location: Location,private todoService: TodoService) { }

  ngOnInit() {
    this.getInspeccion();
  }

  getInspeccion(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.todoService.getTodo(id)
    .subscribe(inspeccion => this.inspeccion = inspeccion);
  }

  goBack(): void {
    this.location.back();
  }
  

}
