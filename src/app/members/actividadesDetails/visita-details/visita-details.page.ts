import { Component, OnInit } from '@angular/core';
import { ActividadesService } from './../../../_services/actividades.service';
import {  ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-visita-details',
  templateUrl: './visita-details.page.html',
  styleUrls: ['./visita-details.page.scss'],
})
export class VisitaDetailsPage implements OnInit {
  visitaEscuela;
  idInspector=1;

  constructor(private visitaService: ActividadesService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    let idVisita=this.route.snapshot.paramMap.get('id');
    console.log(idVisita);
    this.visitaService.getVisita(idVisita,this.idInspector) .subscribe(res  =>{
      console.log(res);
      this.visitaEscuela=[res];

     }  
    );;

  }


  // Conversiones para que se vea con un formato mejor
  stringAsDate(dateStr) {
    let reemplazar=dateStr.replace(/-/g,"/");
    return new Date(reemplazar);
  }


  hora(dateStr){
    var a=dateStr.split(" ")
    return a[1];
  }

}
