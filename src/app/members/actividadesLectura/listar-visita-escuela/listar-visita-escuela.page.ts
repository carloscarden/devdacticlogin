import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import {  AlertController  } from '@ionic/angular';



/* SERVICES  */
import { ActividadesService } from './../../../_services/actividades.service';
import { AuthenticationService } from './../../../_services/authentication.service';



@Component({
  selector: 'app-listar-visita-escuela',
  templateUrl: './listar-visita-escuela.page.html',
  styleUrls: ['./listar-visita-escuela.page.scss'],
})
export class ListarVisitaEscuelaPage implements OnInit {
  url;
  tipo;
  filtroTipo=false;
  page = 0;
  maximumPages = 3;
  visitasEscuelas=[];
  size=5;
  opciones=["Convocatoria","Trabajo Administrativo","Visita Escuela","Licencia"];
  inspectorId=1;


  constructor(private visitaService: ActividadesService,
              private alertCtrl: AlertController,
              private authenticationService: AuthenticationService) {
    this.url=""
    console.log("creacion del listar visitas");
    let currentUser = this.authenticationService.currentUserValue;
    this.inspectorId= currentUser.id;
      this.visitaService.getVisitas(this.size,this.page,this.inspectorId)
      .subscribe(res  =>{
                  console.log(res.content);
                  this.visitasEscuelas=res.content;
                  this.maximumPages=res.totalPages-1;
                  }  
      );
   }

  ngOnInit() {
    console.log("init del visita escuela");
  }


  loadVisitas(page, infiniteScroll? ) {
    if(page <= this.maximumPages){
      let currentUser = this.authenticationService.currentUserValue;
      this.inspectorId= currentUser.id;
      this.visitaService.getVisitas(this.size,page,this.inspectorId)
      .subscribe(res  =>{
                   console.log("page"); console.log(this.page);
                   this.visitasEscuelas=this.visitasEscuelas.concat(res['content']);
                   console.log(this.visitasEscuelas);
                   if(this.filtroTipo){
                     if(!(this.tipo === "")){
                        console.log("entro");
                        this.visitasEscuelas = this.visitasEscuelas.filter(items => items.establecimiento.cue.toLowerCase() === this.tipo.toLowerCase());
                        console.log(this.visitasEscuelas);
                     }
                    
                   }
                   
                   if (infiniteScroll) {
                    infiniteScroll.target.complete();       
                    }             
                });


    }
    
  }


  loadMore(infiniteScroll) {
    this.page++;
    console.log("load more");
    this.loadVisitas(this.page,infiniteScroll);
    if (this.page >= this.maximumPages ) {
      infiniteScroll.target.disabled = true;
    }
  }


  filtrar(infiniteScroll?){
    console.log("filtrar");
    this.filtroTipo=true;
    this.visitasEscuelas = [];
    this.page=0;
    while(this.visitasEscuelas.length<2 && !(this.page === this.maximumPages+1)){
      this.loadVisitas(this.page, infiniteScroll );
      console.log(this.visitasEscuelas);
      this.page++;
    }
      
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
