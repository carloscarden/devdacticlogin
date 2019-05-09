import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../../_services/authentication.service';
import { TrabajoAdminServiceService } from './../../../_services/trabajo-admin-service.service';


import {  ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-trabajo-admin-details',
  templateUrl: './trabajo-admin-details.page.html',
  styleUrls: ['./trabajo-admin-details.page.scss'],
})
export class TrabajoAdminDetailsPage implements OnInit {
  trabajoAdmin;
  idInspector=1;

  constructor(private trabajoAdminService: TrabajoAdminServiceService,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute) { }

  ngOnInit() {

    let idTrabajoAdmin=this.route.snapshot.paramMap.get('id');
    console.log(idTrabajoAdmin);
    let currentUser = this.authenticationService.currentUserValue;
    this.idInspector= currentUser.id;
    this.trabajoAdminService.getTrabajo(idTrabajoAdmin,this.idInspector) .subscribe(res  =>{
      console.log(res);
      this.trabajoAdmin=[res];
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

  esUnaImagen(tipo){
    console.log(tipo);
    let tipoLower=tipo.toLowerCase();
    console.log( tipoLower.includes("image"));
    return tipoLower.includes("image");
  }


}
