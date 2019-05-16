import { Component, OnInit } from '@angular/core';



/* SERVICES  */
import { VisitaServiceService } from './../../../_services/visita-service.service';
import { AuthenticationService } from './../../../_services/authentication.service';



@Component({
  selector: 'app-listar-visita-escuela',
  templateUrl: './listar-visita-escuela.page.html',
  styleUrls: ['./listar-visita-escuela.page.scss'],
})
export class ListarVisitaEscuelaPage implements OnInit {
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
  visitaMotivo;

  // para la recoleccion de los datos 
  page = 0;
  maximumPages = 3;
  visitasEscuelas=[];
  size=3;
  tiposMotivos;

  // para seleccionar el tipo de actividad
  opciones=["Convocatoria","Trabajo Administrativo","Visita Escuela","Licencia"];
  inspectorId=1;


  constructor(private visitaService: VisitaServiceService,
              private authenticationService: AuthenticationService) {
        this.url=""
        let currentUser = this.authenticationService.currentUserValue;
        this.inspectorId= currentUser.id;

        // recoger la primera pagina de los informes de las visitas 
          this.visitaService.getVisitas(this.size,this.page,this.inspectorId)
          .subscribe(res  =>{
                      if(res!=null){
                        console.log(res.content);
                        this.visitasEscuelas=res.content;
                        this.maximumPages=res.totalPages-1;
                        console.log("total de paginas",res.totalPages);
                        this.page++;
                        }  

                      }
                     
          );

          this.tipoFiltro="Todos.";


          // recoger el arreglo de motivos para llenar el selectable
          this.visitaService.getMotivosVisitas().subscribe(
            tipos=>{
                this.tiposMotivos=tipos;
                this.tiposMotivos.unshift({codigo: 0, descripcion: "Todos."})
            }
          );
   }

  ngOnInit() {
    console.log("init del visita escuela");
  }


  loadVisitas(page, infiniteScroll? ) {
    console.log("pagina menor a maximumPages", page <= this.maximumPages);
    if(page <= this.maximumPages){
      let currentUser = this.authenticationService.currentUserValue;
      this.inspectorId= currentUser.id;
      if(this.filtroActivado ){
          let usrQuiereFiltroFecha = this.usuarioQuiereFiltrarPorFecha();
          if(usrQuiereFiltroFecha){
            this.cargarVisitasDesdeHasta(page,infiniteScroll);
          }
          else{
            this.cargarVisitas(page, infiniteScroll);    
          }
      }
      else{
        this.cargarVisitas(page, infiniteScroll);
      }
     
    }
    
  }

  cargarVisitasDesdeHasta(page,infiniteScroll?){
    console.log("cargar convocatorias desde hasta");
    let diaInicio = new Date(this.inicioFiltro);
    let formatoCorrectoInicio = diaInicio.getDate()+"/"+(diaInicio.getMonth()+1)+"/"+diaInicio.getFullYear();

    let diaFin = new Date(this.finFiltro);
    let formatoCorrectoFin = diaFin.getDate()+"/"+(diaFin.getMonth()+1)+"/"+diaFin.getFullYear();


    if(this.tipoFiltro=="Todos."){
        this.visitaService.getVisitasByDate(this.size,page,this.inspectorId, formatoCorrectoInicio, formatoCorrectoFin)
        .subscribe(res  =>{

                    if(res!=null){
                        console.log("page"); console.log(this.page);
                        this.visitasEscuelas=this.visitasEscuelas.concat(res['content']);
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
      this.visitaService.getVisitasByDateAndMotivo(this.size,page,this.inspectorId, formatoCorrectoInicio, formatoCorrectoFin, this.tipoFiltro)
      .subscribe(res  =>{

                  if(res!=null){
                    console.log("page"); console.log(this.page);
                    this.visitasEscuelas=this.visitasEscuelas.concat(res['content']);
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

  cargarVisitas(page,infiniteScroll?){
    console.log("cargar convocatorias sin fechas");
    if(this.tipoFiltro=="Todos."){
          console.log("cargar todas las convocatorias");
          this.visitaService.getVisitas(this.size,page,this.inspectorId)
          .subscribe(res  =>{

                      if(res!= null){
                        this.visitasEscuelas=this.visitasEscuelas.concat(res['content']);
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
          console.log("cargar las convocatorias motivo");
          console.log("motivo", this.tipoFiltro);
         this.visitaService.getVisitasByMotivo(this.size,page,this.inspectorId, this.tipoFiltro)
         .subscribe(res  =>{

                if(res!=null){

                  console.log("page"); console.log(this.page);
                  this.visitasEscuelas=this.visitasEscuelas.concat(res['content']);
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
    this.restInfScroll=infiniteScroll;
    this.loadVisitas(this.page,infiniteScroll);
    if (this.page >= this.maximumPages ) {
      infiniteScroll.target.disabled = true;
    }
  }


  filtrar(infiniteScroll?){
    console.log("filtrar");
    console.log("visitaMotivo a filtrar", this.visitaMotivo);

     // resetear el infinite scroll
     if(this.restInfScroll!=null){
      this.restInfScroll.target.disabled=false;
    }
  

    if(!this.fechasNoValidas){
        this.filtroActivado=true;
        this.visitasEscuelas = [];
        this.page=0;
        this.inicioFiltro=this.inicio;
        this.finFiltro=this.fin;

        if(this.visitaMotivo){
          this.tipoFiltro=this.visitaMotivo.codigo;
          if(this.tipoFiltro==0){
            this.tipoFiltro="Todos.";
          }

        }
        else{
          this.tipoFiltro="Todos.";
        }
        

         // resetear el infinite scroll
         if(this.restInfScroll!=null){
          this.restInfScroll.target.disabled=false;
        }
      
        this.loadVisitas(this.page, infiniteScroll );

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
