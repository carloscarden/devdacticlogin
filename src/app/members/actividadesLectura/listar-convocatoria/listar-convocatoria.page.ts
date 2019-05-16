import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

/*  SERVICES */
import { ConvocatoriaServiceService } from './../../../_services/convocatoria-service.service';
import { AuthenticationService } from './../../../_services/authentication.service';







@Component({
  selector: 'app-listar-convocatoria',
  templateUrl: './listar-convocatoria.page.html',
  styleUrls: ['./listar-convocatoria.page.scss'],
})
export class ListarConvocatoriaPage implements OnInit {
  url;
  restInfScroll;

  //para el filtro
  tipo;
  filtroActivado=false;
  inicio;
  fin;
  fechasNoValidas=false;
  inicioFiltro;
  finFiltro;
  tipoFiltro;

  actividadesSubscription: Subscription;
 
   // para la recoleccion de los datos 
  page = 0;
  maximumPages = -1;
  idInspector=1;
  convocatorias=[];
  size=40;



  opciones=["Convocatoria","Trabajo Administrativo","Visita Escuela","Licencia"];


  // para el selectable del filtro
  tipoConvocatoria;
  tiposConvocatoria;

  constructor(private convocatoriaService: ConvocatoriaServiceService,
              private authenticationService: AuthenticationService
            ) {
                this.url=""

                let currentUser = this.authenticationService.currentUserValue;
                this.idInspector= currentUser.id;
                this.tipoFiltro="Todos.";
                this.convocatoriaService.getConvocatorias(this.size,this.page, this.idInspector)
                .subscribe(res  =>{
                             if(res!=null){
                              this.convocatorias=res.content;
                              this.maximumPages=res.totalPages-1;
                              this.page++;
                             }
                             else{
                               this.maximumPages=-1;
                             }
                            
                            }  
                           );

              this.convocatoriaService.getTipoConvocatorias()
                      .subscribe(tipos => {
                        console.log("tipos",tipos);
                        this.tiposConvocatoria=tipos;
                        this.tiposConvocatoria.unshift({codigo: 0, descripcion: "Todos."})
                        }
                        );

  }

  ngOnInit() {
    this.url=""
  }



  loadConvocatorias(page, infiniteScroll? ) {

    console.log("llego page <= maximumPages",page <= this.maximumPages );
    if(page <= this.maximumPages){
      let currentUser = this.authenticationService.currentUserValue;
      this.idInspector= currentUser.id;
      if(this.filtroActivado ){
              let usrQuiereFiltroFecha = this.usuarioQuiereFiltrarPorFecha();
              if(usrQuiereFiltroFecha){
                this.cargarConvocatoriasDesdeHasta(page,infiniteScroll);
              }
              else{

                this.cargarConvocatorias(page, infiniteScroll);    
              }
      }
      else{
        this.cargarConvocatorias(page, infiniteScroll);
      }


    }
    
  }


  cargarConvocatoriasDesdeHasta(page,infiniteScroll?){
    console.log("cargar convocatorias desde hasta");
    let diaInicio = new Date(this.inicioFiltro);
    let formatoCorrectoInicio = diaInicio.getDate()+"/"+(diaInicio.getMonth()+1)+"/"+diaInicio.getFullYear();

    let diaFin = new Date(this.finFiltro);
    let formatoCorrectoFin = diaFin.getDate()+"/"+(diaFin.getMonth()+1)+"/"+diaFin.getFullYear();

    if(this.tipoFiltro=="Todos."){
          this.convocatoriaService.getConvocatoriasByDate(this.size,page,this.idInspector, formatoCorrectoInicio, formatoCorrectoFin)
          .subscribe(res  =>{
                      if(res!=null){
                        this.convocatorias=this.convocatorias.concat(res['content']);
                        this.page++;
                        this.maximumPages= res.totalPages-1;
        
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
          this.convocatoriaService.getConvocatoriasByArticuloAndDate(this.size,page,this.idInspector, formatoCorrectoInicio, formatoCorrectoFin,this.tipoFiltro)
          .subscribe(res  =>{

                      if(res!=null){
                        this.convocatorias=this.convocatorias.concat(res['content']);
                        this.page++;
                        this.maximumPages= res.totalPages-1;
        
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



  cargarConvocatorias(page,infiniteScroll?){


    if(this.tipoFiltro=="Todos."){

             console.log("cargar convocatorias todas", this.tipoFiltro)

            this.convocatoriaService.getConvocatorias(this.size,page, this.idInspector)
            .subscribe(res  =>{
                        if(res!=null){
                            console.log("resultados de cargar todas las convocatorias");
                            this.convocatorias=this.convocatorias.concat(res['content']);
                            this.page++;
                            this.maximumPages= res.totalPages-1;
                            
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
           console.log("cargar convocatorias por tipo", this.tipoFiltro)
            this.convocatoriaService.getConvocatoriasByArticulo(this.size,page, this.idInspector, this.tipoFiltro)
            .subscribe(res  =>{
                        if(res!=null){
                          console.log("resultados de cargar por tipo", res);
                          this.convocatorias=this.convocatorias.concat(res['content']);
                          this.page++;
                          this.maximumPages= res.totalPages-1;
                          
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
    this.restInfScroll=infiniteScroll;
    this.loadConvocatorias(this.page,infiniteScroll);
    if (this.page >= this.maximumPages ) {
      infiniteScroll.target.disabled = true;
    }
  }


  filtrar(infiniteScroll?){
    console.log("filtrar");
      // reiniciar el infinit scroll
      if(this.restInfScroll!=null){
        this.restInfScroll.target.disabled=false;
      }
      

    if(!this.fechasNoValidas){

        this.filtroActivado=true;
        this.convocatorias = [];
        this.page=0;
        this.inicioFiltro=this.inicio;
        this.finFiltro=this.fin;

         // reiniciar el infinit scroll
         if(this.restInfScroll!=null){
          this.restInfScroll.target.disabled=false;
        }
        
        if(this.tipoConvocatoria){
          this.tipoFiltro=this.tipoConvocatoria.codigo;
          if(this.tipoFiltro==0){
            this.tipoFiltro="Todos."
          }
        }
        else{
          this.tipoFiltro="Todos.";
        }

        console.log("filtro tipo");




       
        
    
        let currentUser = this.authenticationService.currentUserValue;
        this.idInspector= currentUser.id;
        if(this.filtroActivado ){
                let usrQuiereFiltroFecha = this.usuarioQuiereFiltrarPorFecha();
                if(usrQuiereFiltroFecha){
                  this.cargarConvocatoriasDesdeHasta(this.page,infiniteScroll);
                }
                else{

                  this.cargarConvocatorias(this.page, infiniteScroll);    
                }
        }
        else{
          this.cargarConvocatorias(this.page, infiniteScroll);
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
