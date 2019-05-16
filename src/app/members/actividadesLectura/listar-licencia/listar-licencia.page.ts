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
  filtroActivado=false;
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
  size=40;

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
      this.licenciaService.getLicencias1(this.size,this.page,this.inspectorId, null, null, null)
      .subscribe(res  =>{
                    if(res!=null){
                      this.licencias=res.content;
                      this.page++;
                      this.maximumPages=res.totalPages-1;
                    }
                    else{
                      this.maximumPages=-1;
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
      
      let usrQuiereFiltroFecha = this.usuarioQuiereFiltrarPorFecha();
      if(usrQuiereFiltroFecha){
          this.cargarLicenciasDesdeHasta(page,infiniteScroll);
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


    if(!(this.tipoFiltro === "")){

      this.licenciaService.getLicencias1(this.size,page,this.inspectorId, formatoCorrectoInicio, formatoCorrectoFin, this.tipoFiltro)
      .subscribe(res  =>{
                   if(res!=null){
                          this.licencias=this.licencias.concat(res['content']);
                          this.page++;
                          this.maximumPages= res.totalPages-1;

                          console.log(this.licencias);

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
      this.licenciaService.getLicencias1(this.size,page,this.inspectorId, formatoCorrectoInicio, formatoCorrectoFin, null)
      .subscribe(res  =>{
                   if(res!=null){
                          this.licencias=this.licencias.concat(res['content']);
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

  cargarLicencias(page,infiniteScroll?){

    if(!(this.tipoFiltro === "")){
     
      this.licenciaService.getLicencias1(this.size,page,this.inspectorId,null,null,this.tipoFiltro)
      .subscribe(res  =>{
                    
                    console.log("res",res!=null);
                    if(res!=null){
                        this.licencias=this.licencias.concat(res['content']);
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
      console.log("filtro vacio",this.tipoFiltro);
      this.licenciaService.getLicencias1(this.size,page,this.inspectorId,null,null,null)
      .subscribe(res  =>{
                    
                    console.log("res",res!=null);
                    if(res!=null){
                        this.licencias=this.licencias.concat(res['content']);
                        this.page++;
                        this.maximumPages= res.totalPages-1;

                        console.log("licencias despues del filtro",this.licencias);
                        
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
    console.log("cargar mas");
    console.log("maximum pages", this.maximumPages);
    console.log("pages", this.page);
    this.restInfScroll=infiniteScroll;

    // pido licencias hasta que por lo menos haya dos porque asi se activa el infinite scroll
    this.loadLicencias(this.page,infiniteScroll);
    
 
    if (this.page >= this.maximumPages) {
      infiniteScroll.target.disabled = true;
    }
  }

  filtrar(infiniteScroll?){
    console.log("hay infinite scroll",this.restInfScroll);
    if(this.restInfScroll!=null){
      console.log("disable",this.restInfScroll.target.disabled );
      this.restInfScroll.target.disabled=false;

      console.log("reseteo de la variable de scroll",this.restInfScroll.target.disabed);
    }

    if(!this.fechasNoValidas){
          this.inicioFiltro=this.inicio;
          this.finFiltro=this.fin;
          this.tipoFiltro=this.tipo;
          console.log(this.tipoFiltro);
          console.log(this.restInfScroll);
          if(this.restInfScroll!=null){
            this.restInfScroll.target.disabled=false;

            console.log("reseteo de la variable de scroll",this.restInfScroll.target.disabed);
          }
          this.filtroActivado=true;
          this.licencias = [];
          this.page=0;




          let currentUser = this.authenticationService.currentUserValue;
          this.inspectorId= currentUser.id;
          
          let usrQuiereFiltroFecha = this.usuarioQuiereFiltrarPorFecha();
          if(usrQuiereFiltroFecha){
              this.cargarLicenciasDesdeHasta(this.page,infiniteScroll);
          }
          else{
            this.cargarLicencias(this.page, infiniteScroll);    
          }
      

          console.log("licencias cargadas", this.licencias);
    }
      
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
