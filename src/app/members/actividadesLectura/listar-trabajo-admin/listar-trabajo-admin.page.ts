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
  filtroActivado=false;
  inicio;
  fin;
  fechasNoValidas=false;
  inicioFiltro;
  finFiltro;
  tipoFiltro;

  trabajoAdmin;
  tiposTrabajos;


  page = 0;
  maximumPages = 3;
  trabajosAdmin=[];
  size=30;
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
                 console.log("resultados",res);
                 this.trabajosAdmin=res.content;
                 this.maximumPages=res.totalPages-1;
                 this.page++;
                }  
               );

    this.trabajosService.getTipoTrabajoAdministrativo().subscribe(
      tipos=>{
          console.log("tipos",tipos);
          this.tiposTrabajos=tipos;
          this.tiposTrabajos.unshift({codigo: 0, descripcion: "Todos."})
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
      if(this.filtroActivado ){
              let usrQuiereFiltroFecha = this.usuarioQuiereFiltrarPorFecha();
              if(usrQuiereFiltroFecha){
                this.cargarTrabajosDesdeHasta(page,infiniteScroll);
              }
              else{
                this.cargarTrabajos(page, infiniteScroll);    
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
                 console.log("trabajos administrativos",this.trabajosAdmin);
                 if(this.filtroActivado){
                   if(!(this.tipoFiltro === "")){
                      console.log("entro");
                      if(!(this.tipoFiltro === "Todos.")){
                        this.trabajosAdmin = this.trabajosAdmin.filter(items => items.tipoTrabajoAdmin.descripcion.toLowerCase() === this.tipoFiltro.toLowerCase());

                      }
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
                   console.log("trabajos administrativos",this.trabajosAdmin);
                   console.log(this.tipoFiltro);

                   if(this.filtroActivado){
                     if(!(this.tipoFiltro === "")){
                        console.log("entro");
                        if(!(this.tipoFiltro === "Todos.")){
                        this.trabajosAdmin = this.trabajosAdmin.filter(items => items.tipoTrabajoAdmin.descripcion.toLowerCase() === this.tipoFiltro.toLowerCase());
                        }
                        console.log(this.trabajosAdmin);
                     }
                    
                   }
                   this.page++;
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
    console.log("tipoTrabajoAdmin a filtrar", this.trabajoAdmin);
    if(!this.fechasNoValidas){
        console.log("filtrar");
        this.filtroActivado=true;
        this.trabajosAdmin = [];
        this.page=0;
        this.inicioFiltro=this.inicio;
        this.finFiltro=this.fin;

        this.tipoFiltro=this.trabajoAdmin.descripcion;

        while(this.trabajosAdmin.length<10 && !(this.page === this.maximumPages+1)){
          this.loadTrabajosAdmin(this.page, infiniteScroll );
          console.log(this.trabajosAdmin);
          this.page++;
        }
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


 usuarioQuiereFiltrarPorFecha(){
  let fechasVacias= (this.inicioFiltro ==null || this.finFiltro == null);

  if(this.filtroActivado && !fechasVacias && !this.fechasNoValidas){
    return true;
  }
  else{
    return false;
  }
}


 


  


}
