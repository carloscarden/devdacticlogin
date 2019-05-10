import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';



/* SERVICES */
import { LicenciaServiceService } from './../../../_services/licencia-service.service';

import { AuthenticationService } from './../../../_services/authentication.service';


/* MODELS */
import { Pagina } from './../../../_models/pagina';

@Component({
  selector: 'app-listar-licencia',
  templateUrl: './listar-licencia.page.html',
  styleUrls: ['./listar-licencia.page.scss'],
})
export class ListarLicenciaPage implements OnInit {
  url;
  restInfScroll;

  // para el filtro
  tipo;
  filtroTipo=false;
  inicio;
  fin;
  fechasNoValidas=false;
  inicioFiltro;
  finFiltro;
  tipoFiltro;


  // para la recoleccion de los datos 
  pagLicencia: Pagina;
  page = 0;
  maximumPages = -1;
  licencias=[];
  size=5;

  // para seleccionar el tipo de actividad
  opciones=["Convocatoria","Trabajo Administrativo","Visita Escuela","Licencia"];
  value=0;

  inspectorId=1;

  constructor( private router:Router,
    private authenticationService: AuthenticationService,
    private licenciaService:LicenciaServiceService,
    ) { 
      this.url="";
      let currentUser = this.authenticationService.currentUserValue;
      this.inspectorId= currentUser.id;
      this.licenciaService.getLicencias(this.size,this.page,this.inspectorId)
      .subscribe(res  =>{
                    if(res!=null){
                      console.log(res);
                      this.licencias=res.content;
                      this.maximumPages=res.totalPages-1;
                    }
                  
                  }  
                 );
    }

    


  ngOnInit() { 
    this.url="";
  }


  loadLicencias(page, infiniteScroll? ) {
    if(page <= this.maximumPages){
      let currentUser = this.authenticationService.currentUserValue;
      this.inspectorId= currentUser.id;
      let fechasVacias= (this.inicioFiltro ==null || this.finFiltro == null);
      if(this.filtroTipo ){
            if (fechasVacias){
              console.log("las fechas estan vacias");
              this.cargarLicencias(page, infiniteScroll);
            }
            else{
              if(this.fechasNoValidas){
                console.log("error en las fechas");
                this.cargarLicencias(page, infiniteScroll);
              }
              else{
                console.log("cargar licencias desde hasta");
                this.cargarLicenciasDesdeHasta(page,infiniteScroll);
              }
      
          }
      }
      else{
        this.cargarLicencias(page, infiniteScroll);
      }
     
    }
  }


  cargarLicenciasDesdeHasta(page,infiniteScroll?){
    console.log("cargar licencias desde hasta");
    let diaInicio = new Date(this.inicioFiltro);
    let formatoCorrectoInicio = diaInicio.getDate()+"/"+(diaInicio.getMonth()+1)+"/"+diaInicio.getFullYear();

    let diaFin = new Date(this.finFiltro);
    let formatoCorrectoFin = diaFin.getDate()+"/"+(diaFin.getMonth()+1)+"/"+diaFin.getFullYear();

    this.licenciaService.getLicenciasByDate(this.size,page,this.inspectorId, formatoCorrectoInicio, formatoCorrectoFin)
    .subscribe(res  =>{
                 console.log("page"); console.log(this.page);
                 console.log("res",res);
                 if(res!=null){
                        this.licencias=this.licencias.concat(res['content']);
                        console.log("licencias cargadas", this.licencias);
                        if(this.filtroTipo){
                          if(!(this.tipo === "")){
                            console.log("tipo filtro 1",this.tipoFiltro);
                            console.log("entro 1", this.licencias);
                            this.licencias = this.licencias.filter(items => items.articulo.toLowerCase() === this.tipo.toLowerCase());
                            console.log("licencias despues del filtro 1",this.licencias);
                          }
                        
                        }
                        
                        if (infiniteScroll) {
                        infiniteScroll.target.complete();       
                        }     

                 }
                        
              });

  }

  cargarLicencias(page,infiniteScroll?){
    this.licenciaService.getLicencias(this.size,page,this.inspectorId)
      .subscribe(res  =>{
                    
                    console.log("res",res!=null);
                    if(res!=null){
                        console.log("page"); console.log(this.page);
                        this.licencias=this.licencias.concat(res['content']);
                        console.log("licencias",this.licencias);
                        if(this.filtroTipo){
                          if(!(this.tipo === "")){
                            console.log("tipo filtro 1",this.tipo.toLowerCase());
                            console.log("entro 1", this.licencias);
                            console.log(this.licencias.filter(items => items.articulo.toLowerCase() === this.tipo.toLowerCase()));
                            this.licencias = this.licencias.filter(items => items.articulo.toLowerCase() === this.tipo.toLowerCase());
                            console.log("licencias despues del filtro 1", this.licencias);
                          }
                        
                        }
                        
                        if (infiniteScroll) {
                        infiniteScroll.target.complete();       
                        }  

                    }
                             
                });

  }
 
  loadMore(infiniteScroll) {
    this.restInfScroll=infiniteScroll;
    this.page++;
    this.loadLicencias(this.page,infiniteScroll);
 
    if (this.page >= this.maximumPages) {
      infiniteScroll.target.disabled = true;
    }
  }

  filtrar(infiniteScroll?){
    console.log("entro al filtrar");
    console.log("filtro tipo",this.tipo);
    this.inicioFiltro=this.inicio;
    this.finFiltro=this.fin;
    this.tipoFiltro=this.tipo;
    console.log(this.tipoFiltro);
    if(this.restInfScroll!=null){
      this.restInfScroll.target.disabled=false;
    }
    this.filtroTipo=true;
    this.licencias = [];
    this.page=0;
    while(this.licencias.length<2 && !(this.page === this.maximumPages+1)){
      console.log("entra a licencias");
      this.loadLicencias(this.page, infiniteScroll );
      this.page++;
    }
    console.log("licencias cargadas", this.licencias);
      
  }

   // Conversiones para que se vea con un formato mejor
  stringAsDate(dateStr) {
    let reemplazar=dateStr.replace(/-/g,"/");
    return new Date(reemplazar);
  }


  validarFechas(){
    console.log(this.inicio);
    console.log(this.fin);
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
