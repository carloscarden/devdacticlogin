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


  
  datePickerObj: any = {
    showTodayButton: false, // default true
    fromDate: new Date('2016-12-08'), // default null
    toDate: new Date('2100-12-28'),
    closeOnSelect: true, // default false
    setLabel: 'Aceptar',  // default 'Set'
    todayLabel: 'Hoy', // default 'Today'
    closeLabel: 'Cancelar', // default 'Close'
    dateFormat: 'DD-MM-YYYY',
    titleLabel: 'Seleccione una fecha', // default null
    monthsList: ["En", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    weeksList: ["D", "L", "M", "M", "J", "V", "S"],
    momentLocale: 'es-AR', // Default 'en-US'
    btnProperties: {
      expand: 'block', // Default 'block'
      fill: '', // Default 'solid'
      size: '10px', // Default 'default'
      disabled: '', // Default false
      strong: '', // Default false
      color: '' // Default ''
    },
    arrowNextPrev: {
      nextArrowSrc: 'assets/images/arrow_right.svg',
      prevArrowSrc: 'assets/images/arrow_left.svg'
    } // This object supports only SVG files.
  };

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
    let diaInicio = this.inicioFiltro.split("-");
    let formatoCorrectoInicio = diaInicio[0]+"/"+diaInicio[1]+"/"+diaInicio[2];

    let diaFin = this.finFiltro.split("-");
    let formatoCorrectoFin = diaFin[0]+"/"+diaFin[1]+"/"+diaFin[2];


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
      let licenciasAllenar=[];
      let contenidoDelPDF=this.diseniarPDFcomoLoQuiereElUsuario();
      contenidoDelPDF.subscribe(res  =>{
        if(res!=null){
          licenciasAllenar=licenciasAllenar.concat(res['content']);
          let contenidoArmadoParaElPDF=this.armarPDF(licenciasAllenar);
          this.abrirYdescargarPDF(contenidoArmadoParaElPDF);

        }
        else{
          let contenidoArmadoParaElPDF=this.armarPDF(licenciasAllenar);
          this.abrirYdescargarPDF(contenidoArmadoParaElPDF);
        
        }
      });
    

  }

  diseniarPDFcomoLoQuiereElUsuario(){
    // funcion que va a recolectar todos los datos del cliente
     let formatoCorrectoFin, formatoCorrectoInicio;
     if(this.inicioFiltro && this.finFiltro){
          let diaInicio = this.inicioFiltro.split("-");
          formatoCorrectoInicio = diaInicio[0]+"/"+diaInicio[1]+"/"+diaInicio[2];
      
          let diaFin = new Date(this.finFiltro);
          formatoCorrectoFin = diaFin[0]+"/"+diaFin[1]+"/"+diaFin[2];
     }

  
    return this.licenciaService.getAllLicencias(this.inspectorId, formatoCorrectoInicio, formatoCorrectoFin, this.tipoFiltro,1000,0)
   


  }





  armarPDF(licenciasAllenar:Array<Licencia>){

    let contenidoArmadoDelPDF=[];

    licenciasAllenar.forEach(licencia => {
      console.log(licencia);
      let contenidoDeLaLicencia=[];
      contenidoDeLaLicencia.push(licencia.inicio, licencia.fin, licencia.encuadre.articulo);
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
            widths: [ '*', '*', '*' ],
            
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
      pdfObj.download("licencias.pdf");
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
            var a = this.inicio.split("-");
            var inicioSinHoras= new Date(parseInt(a[2]) ,parseInt(a[1])-1, parseInt(a[0]));

            var b = this.fin.split("-");
            var finSinHoras= new Date(parseInt(b[2]) ,parseInt(b[1])-1, parseInt(b[0]));

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
      let fechasVacias= (this.inicioFiltro ==null || this.finFiltro == null)  || (this.inicioFiltro=="" || this.finFiltro == "") ;

      if(this.filtroActivado && !fechasVacias && !this.fechasNoValidas){
        return true;
      }
      else{
        return false;
      }
  }






 
}
