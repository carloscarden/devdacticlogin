import { Component, OnInit } from '@angular/core';


import { ActividadesService } from './../../../_services/actividades.service';
import { AuthenticationService } from './../../../_services/authentication.service';

import {  ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-licencia-details',
  templateUrl: './licencia-details.page.html',
  styleUrls: ['./licencia-details.page.scss'],
})
export class LicenciaDetailsPage implements OnInit {
  licencia;
  idInspector=1;

  constructor(private licenciaService: ActividadesService,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute) { }

  ngOnInit() {

    let idLicencia=this.route.snapshot.paramMap.get('id');
    console.log(idLicencia);
    let currentUser = this.authenticationService.currentUserValue;
    this.idInspector= currentUser.id;
    this.licenciaService.getLicencia(idLicencia,this.idInspector) .subscribe(res  =>{
      console.log(res);
      this.licencia=[res];
     }  
    );;
  }

   // Conversiones para que se vea con un formato mejor
   stringAsDate(dateStr) {
    let reemplazar=dateStr.replace(/-/g,"/");
    return new Date(reemplazar);
  }

  

}
