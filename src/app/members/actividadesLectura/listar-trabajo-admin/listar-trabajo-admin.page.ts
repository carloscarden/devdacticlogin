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
  restInfScroll;


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
  size=3;
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
                 this.maximumPages=res.totalPages;
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
    if(this.tipoFiltro=="Todos."){
          this.trabajosService.getTrabajoAdministrativoByDate(this.size,page,this.inspectorId, formatoCorrectoInicio, formatoCorrectoFin)
          .subscribe(res  =>{
                          if(res!=null){
                            this.trabajosAdmin=this.trabajosAdmin.concat(res['content']);
                                    this.page++;
                                    this.maximumPages=res.totalPages;
                                    
                                    if (infiniteScroll) {
                                      infiniteScroll.target.complete();       
                                      }     
                          }
                          else{
                            this.maximumPages=-1;
                          }
                              
                    });

    }
    else{
        this.trabajosService.getTrabajoAdministrativoByDateAndTipo(this.size,page,this.inspectorId, formatoCorrectoInicio, formatoCorrectoFin,this.tipoFiltro)
        .subscribe(res  =>{
                      if(res!=null){
                        this.trabajosAdmin=this.trabajosAdmin.concat(res['content']);
                        this.page++;
                        this.maximumPages=res.totalPages;
                        
                        if (infiniteScroll) {
                          infiniteScroll.target.complete();       
                          }   
                      }
                      else{
                        this.maximumPages=-1;
                      }
                              
                  });

    }
    
    
  }




  cargarTrabajos(page,infiniteScroll?){

    if(this.tipoFiltro=="Todos."){
      console.log("cargar todos los trabajos");
          this.trabajosService.getTrabajoAdministrativo(this.size,page,this.inspectorId)
          .subscribe(res  =>{
                          if(res!=null){
                            this.trabajosAdmin=this.trabajosAdmin.concat(res['content']);
                            this.page++;
                            this.maximumPages=res.totalPages-1;

                            if (infiniteScroll) {
                              infiniteScroll.target.complete();       
                              }      
                          }
                          else{
                            this.maximumPages=-1;
                          }
                            
                    });
    }
    else{
          console.log("cargar un tipo de trabajo", this.tipoFiltro);
          this.trabajosService.getTrabajoAdministrativoByTipo(this.size,page,this.inspectorId, this.tipoFiltro)
              .subscribe(res  =>{
                          if(res!=null){
                            this.trabajosAdmin=this.trabajosAdmin.concat(res['content']);
                            this.page++;
                            this.maximumPages=res.totalPages-1;
  
                            if (infiniteScroll) {
                              infiniteScroll.target.complete();       
                              }      
                          }
                          else{
                            this.maximumPages=-1;
                          }
                                 
                        });


    }
   
  }


  loadMore(infiniteScroll) {
    this.loadTrabajosAdmin(this.page,infiniteScroll);
    this.restInfScroll=infiniteScroll;
    
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


        if(this.trabajoAdmin){
          this.tipoFiltro=this.trabajoAdmin.codigo;
          if(this.tipoFiltro==0){
            this.tipoFiltro="Todos."
          }
        }
        else{
          this.tipoFiltro="Todos.";
        }

        // resetear el infinite scroll
        if(this.restInfScroll!=null){
          this.restInfScroll.target.disabled=false;

          console.log("reseteo de la variable de scroll",this.restInfScroll.target.disabed);
        }

        let usrQuiereFiltroFecha = this.usuarioQuiereFiltrarPorFecha();
        if(usrQuiereFiltroFecha){
              this.cargarTrabajosDesdeHasta(this.page,infiniteScroll);
        }
        else{
            this.cargarTrabajos(this.page, infiniteScroll);    
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
