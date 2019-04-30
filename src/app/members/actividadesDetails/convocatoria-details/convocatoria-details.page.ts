import { Component, OnInit } from '@angular/core';
import { ActividadesService } from './../../../_services/actividades.service';
import { Router, RouterEvent, ActivatedRoute } from '@angular/router';
import {Convocatoria} from './../../../_models/convocatoria'



@Component({
  selector: 'app-convocatoria-details',
  templateUrl: './convocatoria-details.page.html',
  styleUrls: ['./convocatoria-details.page.scss'],
})
export class ConvocatoriaDetailsPage implements OnInit {
  idInspector=1;
  convocatoria;
  

  constructor(private convocatoriaService: ActividadesService,
    private router:Router, private route: ActivatedRoute) {
     



     }

  ngOnInit() {
    let idConvocatoria=this.route.snapshot.paramMap.get('id');
    console.log(idConvocatoria);
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

}
