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
  size=20;



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
                this.convocatoriaService.getConvocatorias(this.size,this.page, this.idInspector)
                .subscribe(res  =>{
                  console.log("resultados",res);
                             if(res!=null){
                              this.convocatorias=res.content;
                              this.maximumPages=res.totalPages-1;
                              this.page++;
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

    this.convocatoriaService.getConvocatoriasByDate(this.size,page,this.idInspector, formatoCorrectoInicio, formatoCorrectoFin)
    .subscribe(res  =>{
                 console.log("page"); console.log(this.page);
                 this.convocatorias=this.convocatorias.concat(res['content']);
                 console.log(this.convocatorias);
                 if(this.filtroActivado){
                   if(!(this.tipoFiltro === "")){
                      console.log("entro");
                      if(!(this.tipoFiltro === "Todos.")){
                        this.convocatorias = this.convocatorias.filter(items => items.tipoConvocatoria.descripcion.toLowerCase() === this.tipoFiltro.toLowerCase());

                      }
                      console.log(this.convocatorias);
                   }
                  
                 }
                 
                 if (infiniteScroll) {
                  infiniteScroll.target.complete();       
                  }             
              });

  }



  cargarConvocatorias(page,infiniteScroll?){

    this.convocatoriaService.getConvocatorias(this.size,page, this.idInspector)
      .subscribe(res  =>{
                   console.log("page"); console.log(this.page);
                   this.convocatorias=this.convocatorias.concat(res['content']);
                   console.log(this.convocatorias);
                   if(this.filtroActivado){
                     if(!(this.tipoFiltro === "")){
                        console.log("entro");
                        if(!(this.tipoFiltro === "Todos.")){
                          this.convocatorias = this.convocatorias.filter(items => items.tipoConvocatoria.descripcion.toLowerCase() === this.tipoFiltro.toLowerCase());
                        }
                        console.log(this.convocatorias);
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
    this.loadConvocatorias(this.page,infiniteScroll);
    if (this.page >= this.maximumPages ) {
      infiniteScroll.target.disabled = true;
    }
  }


  filtrar(infiniteScroll?){
    console.log("tipoconvocatoria",this.tipoConvocatoria);

    if(!this.fechasNoValidas){
        this.filtroActivado=true;
        this.convocatorias = [];
        this.page=0;
        this.inicioFiltro=this.inicio;
        this.finFiltro=this.fin;
        this.tipoFiltro=this.tipoConvocatoria.descripcion;
    
        // el infinite scroll actua cuando hay por lo menos 2 convocatorias, por eso pido paginas hasta tener 2 
        // o hasta llegar al tope de las paginas
        while(this.convocatorias.length<2 && !(this.page === this.maximumPages+1)){
          this.loadConvocatorias(this.page, infiniteScroll );
          console.log(this.convocatorias);
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
