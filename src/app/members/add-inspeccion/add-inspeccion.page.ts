import { Component, OnInit } from '@angular/core';
import { TodoService } from './../../_services/todo.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-inspeccion',
  templateUrl: './add-inspeccion.page.html',
  styleUrls: ['./add-inspeccion.page.scss'],
})
export class AddInspeccionPage implements OnInit {
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
