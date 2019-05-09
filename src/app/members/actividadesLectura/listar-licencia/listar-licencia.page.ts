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

  // para el filtro
  tipo;
  filtroTipo=false;
  inicio;
  fin;
  fechasNoValidas=false;


  // para la recoleccion de los datos 
  pagLicencia: Pagina;
  page = 0;
  maximumPages = 3;
  licencias=[];
  size=2;

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
                   console.log(res);
                   this.licencias=res.content;
                   this.maximumPages=res.totalPages-1;
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
      let fechasVacias= (this.inicio ==null || this.fin == null);
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
    let diaInicio = new Date(this.inicio);
    let formatoCorrectoInicio = diaInicio.getDate()+"/"+(diaInicio.getMonth()+1)+"/"+diaInicio.getFullYear();

    let diaFin = new Date(this.fin);
    let formatoCorrectoFin = diaFin.getDate()+"/"+(diaFin.getMonth()+1)+"/"+diaFin.getFullYear();

    this.licenciaService.getLicenciasByDate(this.size,page,this.inspectorId, formatoCorrectoInicio, formatoCorrectoFin)
    .subscribe(res  =>{
                 console.log("page"); console.log(this.page);
                 this.licencias=this.licencias.concat(res['content']);
                 console.log(this.licencias);
                 if(this.filtroTipo){
                   if(!(this.tipo === "")){
                      console.log("entro");
                      this.licencias = this.licencias.filter(items => items.articulo.toLowerCase() === this.tipo.toLowerCase());
                      console.log(this.licencias);
                   }
                  
                 }
                 
                 if (infiniteScroll) {
                  infiniteScroll.target.complete();       
                  }             
              });

  }

  cargarLicencias(page,infiniteScroll?){
    this.licenciaService.getLicencias(this.size,page,this.inspectorId)
      .subscribe(res  =>{
                   console.log("page"); console.log(this.page);
                   this.licencias=this.licencias.concat(res['content']);
                   console.log(this.licencias);
                   if(this.filtroTipo){
                     if(!(this.tipo === "")){
                        console.log("entro");
                        this.licencias = this.licencias.filter(items => items.articulo.toLowerCase() === this.tipo.toLowerCase());
                        console.log(this.licencias);
                     }
                    
                   }
                   
                   if (infiniteScroll) {
                    infiniteScroll.target.complete();       
                    }             
                });

  }
 
  loadMore(infiniteScroll) {
    this.page++;
    this.loadLicencias(this.page,infiniteScroll);
 
    if (this.page >= this.maximumPages) {
      infiniteScroll.target.disabled = true;
    }
  }

  filtrar(infiniteScroll?){
    console.log("entro al filtrar");
    this.filtroTipo=true;
    this.licencias = [];
    this.page=0;
    while(this.licencias.length<2 && !(this.page === this.maximumPages+1)){
      this.loadLicencias(this.page, infiniteScroll );
      this.page++;
    }
      
  }

   // Conversiones para que se vea con un formato mejor
  stringAsDate(dateStr) {
    let reemplazar=dateStr.replace(/-/g,"/");
    return new Date(reemplazar);
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
