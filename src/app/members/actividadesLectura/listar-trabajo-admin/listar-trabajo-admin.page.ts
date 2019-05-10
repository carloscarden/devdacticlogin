import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';



/*  SERVICES */
import { AuthenticationService } from './../../../_services/authentication.service';
import { TrabajoAdminServiceService } from './../../../_services/trabajo-admin-service.service';



/*  MODELOS */

@Component({
  selector: 'app-listar-trabajo-admin',
  templateUrl: './listar-trabajo-admin.page.html',
  styleUrls: ['./listar-trabajo-admin.page.scss'],
})
export class ListarTrabajoAdminPage implements OnInit {
  url;
  tipo;
  filtroTipo=false;
  inicio;
  fin;
  fechasNoValidas=false;
  inicioFiltro;
  finFiltro;
  tipoFiltro;


  page = 0;
  maximumPages = 3;
  trabajosAdmin=[];
  size=5;
  opciones=["Convocatoria","Trabajo Administrativo","Visita Escuela","Licencia"];
  inspectorId=1;



  constructor( private trabajosService:TrabajoAdminServiceService, 
               private authenticationService: AuthenticationService
              ) { 
    console.log("creacion del listar trabajos admin");
    let currentUser = this.authenticationService.currentUserValue;
    this.inspectorId= currentUser.id;
    this.trabajosService.getTrabajoAdministrativo(this.size,this.page,this.inspectorId)
    .subscribe(res  =>{
                 this.trabajosAdmin=res.content;
                 this.maximumPages=res.totalPages-1;
                }  
               );
  }

  ngOnInit() {
       console.log("init de listar Trabajos Admin");
  }


  loadTrabajosAdmin(page, infiniteScroll? ) {
    if(page <= this.maximumPages){
      let currentUser = this.authenticationService.currentUserValue;
      this.inspectorId= currentUser.id;
      let fechasVacias= (this.inicioFiltro ==null || this.finFiltro == null);
      if(this.filtroTipo ){
          if (fechasVacias){
              console.log("las fechas estan vacias");
              this.cargarTrabajos(page, infiniteScroll);
            }
          else{
              if(this.fechasNoValidas){
                console.log("error en las fechas");
                this.cargarTrabajos(page, infiniteScroll);
              }
              else{
                console.log("cargar licencias desde hasta");
                this.cargarTrabajosDesdeHasta(page,infiniteScroll);
              }
      
          }
      }
      else{
          this.cargarTrabajos(page, infiniteScroll);
      }


    }
    
  }

  cargarTrabajosDesdeHasta(page,infiniteScroll?){
    console.log("cargar convocatorias desde hasta");
    let diaInicio = new Date(this.inicioFiltro);
    let formatoCorrectoInicio = diaInicio.getDate()+"/"+(diaInicio.getMonth()+1)+"/"+diaInicio.getFullYear();

    let diaFin = new Date(this.finFiltro);
    let formatoCorrectoFin = diaFin.getDate()+"/"+(diaFin.getMonth()+1)+"/"+diaFin.getFullYear();

    this.trabajosService.getTrabajoAdministrativoByDate(this.size,page,this.inspectorId, formatoCorrectoInicio, formatoCorrectoFin)
    .subscribe(res  =>{
                 console.log("page"); console.log(this.page);
                 this.trabajosAdmin=this.trabajosAdmin.concat(res['content']);
                 console.log(this.trabajosAdmin);
                 if(this.filtroTipo){
                   if(!(this.tipo === "")){
                      console.log("entro");
                      this.trabajosAdmin = this.trabajosAdmin.filter(items => items.articulo.toLowerCase() === this.tipo.toLowerCase());
                      console.log(this.trabajosAdmin);
                   }
                  
                 }
                 
                 if (infiniteScroll) {
                  infiniteScroll.target.complete();       
                  }             
              });
    
  }




  cargarTrabajos(page,infiniteScroll?){
    this.trabajosService.getTrabajoAdministrativo(this.size,page,this.inspectorId)
      .subscribe(res  =>{
                   console.log("page"); console.log(this.page);
                   this.trabajosAdmin=this.trabajosAdmin.concat(res['content']);
                   console.log(this.trabajosAdmin);
                   if(this.filtroTipo){
                     if(!(this.tipo === "")){
                        console.log("entro");
                        this.trabajosAdmin = this.trabajosAdmin.filter(items => items.tipoTrabajoAdmin.descripcion.toLowerCase() === this.tipo.toLowerCase());
                        console.log(this.trabajosAdmin);
                     }
                    
                   }
                   
                   if (infiniteScroll) {
                    infiniteScroll.target.complete();       
                    }             
                });
  }


  loadMore(infiniteScroll) {
    this.page++;
    console.log("load more");
    this.loadTrabajosAdmin(this.page,infiniteScroll);
    if (this.page >= this.maximumPages ) {
      infiniteScroll.target.disabled = true;
    }
  }


  filtrar(infiniteScroll?){
    console.log("filtrar");
    this.filtroTipo=true;
    this.trabajosAdmin = [];
    this.page=0;
    this.inicioFiltro=this.inicio;
    this.finFiltro=this.fin;
    this.tipoFiltro=this.tipo;

    while(this.trabajosAdmin.length<2 && !(this.page === this.maximumPages+1)){
      this.loadTrabajosAdmin(this.page, infiniteScroll );
      console.log(this.trabajosAdmin);
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


  validarFechas(){
    if(this.inicio!=null){
       if(this.fin!=null){
            console.log("fecha fin menor a fecha inicio",this.fin < this.inicio);
            if(this.fin<this.inicio){

              this.fechasNoValidas=true;
            }
            else{
              this.fechasNoValidas=false;
            }
       }
    }

 }


 


  


}
