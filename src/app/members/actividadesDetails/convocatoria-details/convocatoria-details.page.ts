import { Component, OnInit } from '@angular/core';


import { ActividadesService } from './../../../_services/actividades.service';
import { AuthenticationService } from './../../../_services/authentication.service';


import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-convocatoria-details',
  templateUrl: './convocatoria-details.page.html',
  styleUrls: ['./convocatoria-details.page.scss'],
})
export class ConvocatoriaDetailsPage implements OnInit {
  idInspector=1;
  convocatoria;
  

  constructor(
    private convocatoriaService: ActividadesService,
    private authenticationService: AuthenticationService,
    private router:Router, private route: ActivatedRoute) {
     



     }

  ngOnInit() {
    let idConvocatoria=this.route.snapshot.paramMap.get('id');
    console.log(idConvocatoria);
    let currentUser = this.authenticationService.currentUserValue;
    this.idInspector= currentUser.id;
    this.convocatoriaService.getConvocatoria(idConvocatoria,this.idInspector) .subscribe(res  =>{
      console.log(res);
      this.convocatoria=[res];

     }  
    );;

   
   
  }

  crearArchivo(img){
    let i='data:image/jpeg;base64,'+img;
    return i;
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
    let tipoLower=tipo.toLowerCase();
    return tipoLower.includes("image");
  }

}
