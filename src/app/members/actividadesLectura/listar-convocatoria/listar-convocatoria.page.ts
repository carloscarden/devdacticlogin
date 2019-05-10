import { Component, OnInit } from '@angular/core';

import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';

/*  SERVICES */
import { ConvocatoriaServiceService } from './../../../_services/convocatoria-service.service';
import { AuthenticationService } from './../../../_services/authentication.service';





/*  MODELOS */
import { TipoConvocatoria } from './../../../_models/tipo-convocatoria';



@Component({
  selector: 'app-listar-convocatoria',
  templateUrl: './listar-convocatoria.page.html',
  styleUrls: ['./listar-convocatoria.page.scss'],
})
export class ListarConvocatoriaPage implements OnInit {
  url;
  tipo;
  filtroTipo=false;
  inicio;
  fin;
  fechasNoValidas=false;
  inicioFiltro;
  finFiltro;
  tipoFiltro;

  actividadesSubscription: Subscription;


  page = 0;
  maximumPages = -1;
  idInspector=1;
  convocatorias=[];
  size=5;
  opciones=["Convocatoria","Trabajo Administrativo","Visita Escuela","Licencia"];

  constructor(private convocatoriaService: ConvocatoriaServiceService,
              private authenticationService: AuthenticationService
            ) {
                this.url=""

                let currentUser = this.authenticationService.currentUserValue;
                this.idInspector= currentUser.id;
                this.convocatoriaService.getConvocatorias(this.size,this.page, this.idInspector)
                .subscribe(res  =>{
                             if(res!=null){
                              this.convocatorias=res.content;
                              this.maximumPages=res.totalPages-1;
                             }
                            
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
      let fechasVacias= (this.inicioFiltro ==null || this.finFiltro == null);
      if(this.filtroTipo ){
          if (fechasVacias){
              console.log("las fechas estan vacias");
              this.cargarConvocatorias(page, infiniteScroll);
            }
          else{
              if(this.fechasNoValidas){
                console.log("error en las fechas");
                this.cargarConvocatorias(page, infiniteScroll);
              }
              else{
                console.log("cargar licencias desde hasta");
                this.cargarConvocatoriasDesdeHasta(page,infiniteScroll);
              }
      
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
                 if(this.filtroTipo){
                   if(!(this.tipo === "")){
                      console.log("entro");
                      this.convocatorias = this.convocatorias.filter(items => items.articulo.toLowerCase() === this.tipo.toLowerCase());
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
                   if(this.filtroTipo){
                     if(!(this.tipo === "")){
                        console.log("entro");
                        this.convocatorias = this.convocatorias.filter(items => items.tipoConvocatoria.descripcion.toLowerCase() === this.tipo.toLowerCase());
                        console.log(this.convocatorias);
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
    this.loadConvocatorias(this.page,infiniteScroll);
    if (this.page >= this.maximumPages ) {
      infiniteScroll.target.disabled = true;
    }
  }


  filtrar(infiniteScroll?){
    this.filtroTipo=true;
    this.convocatorias = [];
    this.page=0;
    this.inicioFiltro=this.inicio;
    this.finFiltro=this.fin;
    this.tipoFiltro=this.tipo;

    // el infinite scroll actua cuando hay por lo menos 2 convocatorias, por eso pido paginas hasta tener 2 
    // o hasta llegar al tope de las paginas
    while(this.convocatorias.length<2 && !(this.page === this.maximumPages+1)){
      this.loadConvocatorias(this.page, infiniteScroll );
      console.log(this.convocatorias);
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



    /****************************** TIPOS CONVOCATORIAS ************************************************************ */

    filterPorts(tipos: TipoConvocatoria[], text: string) {
      return tipos.filter(t => {
        return t.descripcion.toLowerCase().indexOf(text) !== -1 ;
      });
    }
  
    searchPorts(event: {
      component: IonicSelectableComponent,
      text: string
    }) {
      let text = event.text.trim().toLowerCase();
      event.component.startSearch();
  
      // Close any running subscription.
      if (this.actividadesSubscription) {
        this.actividadesSubscription.unsubscribe();
      }
  
      this.actividadesSubscription = this.convocatoriaService.getTipoConvocatorias().subscribe(tipos => {
        // Subscription will be closed when unsubscribed manually.
       /* var tareas=JSON.parse(tipos._body);*/
       if (this.actividadesSubscription.closed) {
          return;
        }
  
        event.component.items = this.filterPorts(tipos, text);
        event.component.endSearch();
      });
    }
  
  
    /******************************************************************************************** */



 


}
