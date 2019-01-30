import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-inspeccion',
  templateUrl: './add-inspeccion.page.html',
  styleUrls: ['./add-inspeccion.page.scss'],
})
export class AddInspeccionPage implements OnInit {
  todo = {}
  constructor() { }

  ngOnInit() {
  }

  
  logForm() {
    console.log(this.todo);
  }

  uploadFile() {
   console.log("uploadFile");
  }
  

}
