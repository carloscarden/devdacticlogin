import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { ToastController, Platform, AlertController } from '@ionic/angular';




/* SERVICES */
import { LicenciaServiceService } from './../../../_services/licencia-service.service';

import { AuthenticationService } from './../../../_services/authentication.service';


/* MODELS */
import { Pagina } from './../../../_models/pagina';
import { Licencia } from './../../../_models/licencia';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';


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

  constructor(
    private router:Router,
    private authenticationService: AuthenticationService,
    private licenciaService:LicenciaServiceService,
    private file:File,
    private fileOpener: FileOpener,
    private plt: Platform
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



  /*********************************************************** */


  
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


    let licenciasAllenar=[];
  
    this.licenciaService.getAllLicencias(this.inspectorId, formatoCorrectoInicio, formatoCorrectoFin, this.tipoFiltro)
    .subscribe(res  =>{
                 if(res!=null){
                        licenciasAllenar=licenciasAllenar.concat(res['content']);

                 }
              });

    return licenciasAllenar;

  }





  armarPDF(licenciasAllenar:Array<Licencia>){

    let contenidoArmadoDelPDF=[];

    licenciasAllenar.forEach(licencia => {
      console.log(licencia);
      let contenidoDeLaLicencia=[];
      contenidoDeLaLicencia.push(licencia.inicio, licencia.fin, licencia.articulo);
      contenidoArmadoDelPDF.push(contenidoDeLaLicencia);
    });

    contenidoArmadoDelPDF.unshift(["Inicio","Fin", "Articulo"]);

    var docDefinition  = {
      pageOrientation: 'landscape',
    
     content: [
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ '*', 'auto', 300, '*' ],
            
            body: contenidoArmadoDelPDF
          }
        }
      ]
    }


    return docDefinition ;
    
  }


  abrirYdescargarPDF(contenidoArmadoDelPDF){
    let pdfObj = pdfMake.createPdf(contenidoArmadoDelPDF);

    if (this.plt.is('cordova')) {
        pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'licencias.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'licencias.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      pdfObj.download();
    }

  }

  /*************************************************************** */

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
            var a = new Date(this.inicio);
            var inicioSinHoras= new Date(a.getFullYear(),a.getMonth(),a.getDate());

            var b = new Date(this.fin);
            var finSinHoras= new Date( b.getFullYear(), b.getMonth(), b.getDate());
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
