import { Component, OnInit } from '@angular/core';
import {  Platform } from '@ionic/angular';

import { Subscription } from 'rxjs';

/*  SERVICES */
import { ConvocatoriaServiceService } from './../../../_services/convocatoria-service.service';
import { AuthenticationService } from './../../../_services/authentication.service';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Convocatoria } from 'src/app/_models/convocatoria';





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



  // para el selectable del filtro
  tipoConvocatoria;
  tiposConvocatoria;

  constructor(
              private convocatoriaService: ConvocatoriaServiceService,
              private authenticationService: AuthenticationService,
              private file:File,
              private fileOpener: FileOpener,
              private plt: Platform
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
    let diaInicio = this.inicioFiltro.split("-");
    let formatoCorrectoInicio = diaInicio[0]+"/"+diaInicio[1]+"/"+diaInicio[2];

    let diaFin = this.finFiltro.split("-");
    let formatoCorrectoFin = diaFin[0]+"/"+diaFin[1]+"/"+diaFin[2];

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


  /************************************************ */

  crearPDF(){
    let contenidoDelPDF=this.diseniarPDFcomoLoQuiereElUsuario();
    let contenidoArmadoParaElPDF=this.armarPDF(contenidoDelPDF);
    this.abrirYdescargarPDF(contenidoArmadoParaElPDF);

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


    let convocatoriasAllenar=[];
  
    this.convocatoriaService.getAllConvocatorias(this.idInspector, formatoCorrectoInicio, formatoCorrectoFin, this.tipoFiltro)
    .subscribe(res  =>{
                 if(res!=null){
                  convocatoriasAllenar=convocatoriasAllenar.concat(res['content']);

                 }
              });

    return convocatoriasAllenar;

    
  }

  armarPDF(convocatoriasAllenar: Array<Convocatoria>){

    let contenidoArmadoDelPDF=[];

    convocatoriasAllenar.forEach(convocatoria => {
      console.log(convocatoria);
      let contenidoDeLaLicencia=[];
      contenidoDeLaLicencia.push(convocatoria.inicio, convocatoria.fin, convocatoria.tipoConvocatoria.descripcion, convocatoria.distrito.descripcion, convocatoria.lugar);
      contenidoArmadoDelPDF.push(contenidoDeLaLicencia);
    });

    contenidoArmadoDelPDF.unshift(["Inicio","Fin", "Tipo de convocatoria", "Distrito", "Lugar"]);

    var docDefinition  = {
      pageOrientation: 'landscape',
    
      content: [
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ '*', 'auto', 300, '*', '*', '*' ],
              
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
        this.file.writeFile(this.file.dataDirectory, 'convocatorias.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'convocatorias.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      pdfObj.download("convocatorias.pdf");
    }
  }



  /************************************************ */






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
            var a = this.inicio.split("-");
            var inicioSinHoras= new Date(parseInt(a[2]) ,parseInt(a[1])-1, parseInt(a[0]));
            console.log("inicio a validar",inicioSinHoras);

            var b = this.fin.split("-");
            var finSinHoras= new Date(parseInt(b[2]) ,parseInt(b[1])-1, parseInt(b[0]));
            console.log("fin a validar",finSinHoras);
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
