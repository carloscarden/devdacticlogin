import { Component, OnInit } from '@angular/core';
import {  Platform } from '@ionic/angular';




/*  SERVICES */
import { AuthenticationService } from './../../../_services/authentication.service';
import { TrabajoAdminServiceService } from './../../../_services/trabajo-admin-service.service';



import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';





/*  MODELOS */
import { TrabajoAdministrativo } from 'src/app/_models/trabajo-administrativo';

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
  size=20;
  opciones=["Convocatoria","Trabajo Administrativo","Visita Escuela","Licencia"];
  inspectorId=1;



  constructor( private trabajosService:TrabajoAdminServiceService, 
               private authenticationService: AuthenticationService,
               private file:File,
               private fileOpener: FileOpener,
               private plt: Platform
              ) { 
    console.log("creacion del listar trabajos admin");
    let currentUser = this.authenticationService.currentUserValue;
    this.inspectorId= currentUser.id;
    this.trabajosService.getTrabajoAdministrativo(this.size,this.page,this.inspectorId)
    .subscribe(res  =>{
                 if(res!=null){
                  console.log("resultados",res);
                  this.trabajosAdmin=res.content;
                  this.maximumPages=res.totalPages-1;
                  this.page++;

                 }
                 else{
                   this.maximumPages=-1;
                 }
                
                }  
               );
    this.tipoFiltro="Todos.";

    this.trabajosService.getTipoTrabajoAdministrativo().subscribe(
      tipos=>{
          this.tiposTrabajos=tipos;
          this.tiposTrabajos.unshift({codigo: 0, descripcion: "Todos."})
      }
    );

  }

  ngOnInit() {
       console.log("init de listar Trabajos Admin");
  }


  loadTrabajosAdmin(page, infiniteScroll? ) {
    console.log("page <= this.maximumPages",page <= this.maximumPages );
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

        console.log("cargar un trabajo con tipo", this.tipoFiltro);
        this.trabajosService.getTrabajoAdministrativoByDateAndTipo(this.size,page,this.inspectorId, formatoCorrectoInicio, formatoCorrectoFin,this.tipoFiltro)
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
    if(this.restInfScroll!=null){
      this.restInfScroll.target.disabled=false;
      console.log("despues del disable",this.restInfScroll.target.disabled);
    }
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


  /********************************************** ***********************************************/

  crearPDF(){
    let contenidoDelPDF=this.diseniarPDFcomoLoQuiereElUsuario();
    let contenidoArmadoParaElPDF=this.armarPDF(contenidoDelPDF);
    this.abrirYdescargarPDF(contenidoArmadoParaElPDF);

  }

  diseniarPDFcomoLoQuiereElUsuario(){
    // funcion que va a recolectar todos los datos del cliente
    let formatoCorrectoFin, formatoCorrectoInicio;
    if(this.inicioFiltro && this.finFiltro){
         let diaInicio = new Date(this.inicioFiltro);
         formatoCorrectoInicio = diaInicio.getDate()+"/"+(diaInicio.getMonth()+1)+"/"+diaInicio.getFullYear();
     
         let diaFin = new Date(this.finFiltro);
         formatoCorrectoFin = diaFin.getDate()+"/"+(diaFin.getMonth()+1)+"/"+diaFin.getFullYear();
    }

    
    let trabajoAdminAllenar=[];


    let tipoAEntregar;
    if(this.tipoFiltro!= "Todos."){
      tipoAEntregar=this.tipoFiltro;
    }
  
    this.trabajosService.getAllTrabajos(this.inspectorId, formatoCorrectoInicio, formatoCorrectoFin, tipoAEntregar)
    .subscribe(res  =>{
                 if(res!=null){
                  trabajoAdminAllenar=trabajoAdminAllenar.concat(res['content']);

                 }
              });

    return trabajoAdminAllenar;

  }

  armarPDF(convocatoriasAllenar: Array<TrabajoAdministrativo>){
    let contenidoArmadoDelPDF=[];
    convocatoriasAllenar.forEach(trabajoAdmin => {
      console.log(trabajoAdmin);
      let contenidoDelTrabajoAdmin=[];
      contenidoDelTrabajoAdmin.push(trabajoAdmin.inicio, trabajoAdmin.fin, trabajoAdmin.tipoTrabajoAdmin.descripcion, trabajoAdmin.distrito.descripcion, trabajoAdmin.observaciones);
      contenidoArmadoDelPDF.push(contenidoDelTrabajoAdmin);
    });

    contenidoArmadoDelPDF.unshift(["Inicio","Fin", "Tipo de trabajo", "Distrito", "Observaciones"]);


    var docDefinition  = {
      pageOrientation: 'landscape',
    
      content: [
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ '*', 'auto', 300, '*', '*' ],
              
              body: contenidoArmadoDelPDF
            }
          }
        ]
    }


    return docDefinition ;

  }

  abrirYdescargarPDF(contenidoArmadoParaElPDF){

    let pdfObj = pdfMake.createPdf(contenidoArmadoParaElPDF);

    if (this.plt.is('cordova')) {
        pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'trabajosAdmin.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'trabajosAdmin.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      pdfObj.download("trabajosAdmin.pdf");
    }

  }



  /************************************** */

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
            var a = new Date(this.inicio);
            var inicioSinHoras= new Date(a.getFullYear(),a.getMonth(),a.getDate());

            var b = new Date(this.fin);
            var finSinHoras= new Date( b.getFullYear(), b.getMonth(), b.getDate());
            console.log("fecha fin menor a fecha inicio",this.fin < this.inicio);
            if(finSinHoras<inicioSinHoras){

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
