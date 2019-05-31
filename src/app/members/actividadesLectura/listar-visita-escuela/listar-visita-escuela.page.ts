import { Component, OnInit } from '@angular/core';
import {  Platform } from '@ionic/angular';




/* SERVICES  */
import { VisitaServiceService } from './../../../_services/visita-service.service';
import { AuthenticationService } from './../../../_services/authentication.service';
import { VisitaEscuela } from 'src/app/_models/visita-escuela';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';



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
  size=30;
  tiposMotivos;

  // para seleccionar el tipo de actividad
  opciones=["Convocatoria","Trabajo Administrativo","Visita Escuela","Licencia"];
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


  constructor(private visitaService: VisitaServiceService,
              private authenticationService: AuthenticationService,
              private file:File,
              private fileOpener: FileOpener,
              private plt: Platform) {
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
    let diaInicio = this.inicioFiltro.split("-");
    let formatoCorrectoInicio = diaInicio[0]+"/"+diaInicio[1]+"/"+diaInicio[2];

    let diaFin = this.finFiltro.split("-");
    let formatoCorrectoFin = diaFin[0]+"/"+diaFin[1]+"/"+diaFin[2];


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
      
        let usrQuiereFiltroFecha = this.usuarioQuiereFiltrarPorFecha();
        if(usrQuiereFiltroFecha){
          this.cargarVisitasDesdeHasta(this.page,infiniteScroll);
        }
        else{
          this.cargarVisitas(this.page, infiniteScroll);    
        }

    }
   
      
  }

  /******************************************** */

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

      let visitasAllenar=[];

      this.visitaService.getAllVisitas(this.size,this.inspectorId, formatoCorrectoInicio, formatoCorrectoFin, this.tipoFiltro)
      .subscribe(res  =>{
                   if(res!=null){
                    visitasAllenar=visitasAllenar.concat(res['content']);
  
                   }
                });
  
      return visitasAllenar;
  

 
  }

  armarPDF(visitasAllenar: Array<VisitaEscuela>){
    let contenidoArmadoDelPDF=[];


    visitasAllenar.forEach(visita => {
      console.log(visita);
      let contenidoDeLaVisita=[];
      contenidoDeLaVisita.push(visita.inicio, visita.fin, visita.establecimiento.cue, visita.motivos, visita.acompaniante, visita.observaciones, visita.urgente );
      contenidoArmadoDelPDF.push(contenidoDeLaVisita);
    });

    contenidoArmadoDelPDF.unshift(["Inicio","Fin", "Cue", "Motivo", "Acompañante", "Observaciones", "Situacion de conflicto"]);

    var docDefinition  = {
      pageOrientation: 'landscape',
    
     content: [
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ '*', 'auto', 300, '*', '*', '*', '*', '*' ],
            
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
        this.file.writeFile(this.file.dataDirectory, 'visitas.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'visitas.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      pdfObj.download('visitas.pdf');
    }

  }


  /************************************************* */

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
