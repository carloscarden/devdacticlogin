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
    let diaInicio = this.inicioFiltro.split("-");
    let formatoCorrectoInicio = diaInicio[0]+"/"+diaInicio[1]+"/"+diaInicio[2];

    let diaFin = this.finFiltro.split("-");
    let formatoCorrectoFin = diaFin[0]+"/"+diaFin[1]+"/"+diaFin[2];
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
    let trabajoAdminAllenar=[]
    let contenidoDelPDF=this.diseniarPDFcomoLoQuiereElUsuario();
    contenidoDelPDF.subscribe(res  =>{
      if(res!=null){
        trabajoAdminAllenar=trabajoAdminAllenar.concat(res['content']);
        let contenidoArmadoParaElPDF=this.armarPDF(trabajoAdminAllenar);
        this.abrirYdescargarPDF(contenidoArmadoParaElPDF);

      }
      else{
        let contenidoArmadoParaElPDF=this.armarPDF(trabajoAdminAllenar);
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

    
    let trabajoAdminAllenar=[];


    let tipoAEntregar;
    if(this.tipoFiltro!= "Todos."){
      tipoAEntregar=this.tipoFiltro;
    }
  
    return this.trabajosService.getTrabajosBySize(this.inspectorId, formatoCorrectoInicio, formatoCorrectoFin, tipoAEntregar,1000,0);
  
  }

  armarPDF(convocatoriasAllenar: Array<TrabajoAdministrativo>){
    let contenidoArmadoDelPDF=[];
    let currentUser = this.authenticationService.currentUserValue;
    let inspector= currentUser.nombre+" "+currentUser.apellido;

    var diaDeHoy = new Date();
    var diaDeHoyFormatoPDF = diaDeHoy.getDate()+"/"+(diaDeHoy.getMonth()+1)+"/"+diaDeHoy.getFullYear();

    convocatoriasAllenar.forEach(trabajoAdmin => {
      console.log(trabajoAdmin);
      let contenidoDelTrabajoAdmin=[];
      var formatoInicio=this.formatoHoraPDF(trabajoAdmin.inicio);
      var formatoFin=this.formatoHoraPDF(trabajoAdmin.fin);
      contenidoDelTrabajoAdmin.push(formatoInicio, formatoFin, trabajoAdmin.tipoTrabajoAdmin.descripcion, trabajoAdmin.distrito.descripcion, trabajoAdmin.observaciones);
      contenidoArmadoDelPDF.push(contenidoDelTrabajoAdmin);
    });

    contenidoArmadoDelPDF.unshift(["Inicio","Fin", "Tipo de trabajo", "Distrito", "Observaciones"]);


    var docDefinition  = {
      pageOrientation: 'landscape',
      footer: function(currentPage, pageCount) {
        return {
            margin:10,
            columns: [
            {
                fontSize: 9,
                text:[
                {
                text: '--------------------------------------------------------------------------' +
                '\n',
                margin: [0, 20]
                },
                {
                text: 'Plataforma supervisiva ' + currentPage.toString() + ' de ' + pageCount,
                }
                ],
                alignment: 'center'
            }
            ]
        };
  
      },
    
      content: [
          { text: diaDeHoyFormatoPDF, style: 'anotherStyle' },
          { text: 'Informes trabajo administrativo', style: 'titulo' },   
          { text: 'Inspector: '+inspector, style: 'header' },
  
          { text: '  ', style: [ 'header', 'anotherStyle' ] },
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ '*', '*', 'auto', '*', '*' ],
              
              body: contenidoArmadoDelPDF
            }
          }
        ],
      
      styles: {
          header: {
            fontSize: 19,
          },
          anotherStyle: {
            italics: true,
            alignment: 'right'
          },
          titulo: {
            fontSize: 24,
            bold: true,
            alignment: 'center'
          }
       }
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
            console.log("validar las fechas");
            var a = this.inicio.split("-");
            console.log(a);
            var inicioSinHoras= new Date(parseInt(a[2]) ,parseInt(a[1])-1, parseInt(a[0]));
            console.log("inicio", inicioSinHoras);

            var b =  this.fin.split("-");
            var finSinHoras= new Date(parseInt(b[2]) ,parseInt(b[1])-1, parseInt(b[0]));
            console.log("fin", finSinHoras);
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

   let fechasVacias= (this.inicioFiltro ==null || this.finFiltro == null)  || (this.inicioFiltro=="" || this.finFiltro == "") ;

  if(this.filtroActivado && !fechasVacias && !this.fechasNoValidas){
    return true;
  }
  else{
    return false;
  }
}


formatoHoraPDF(diaYhora){
  var s=diaYhora.split(" ");
  var dia=s[0].split("-");
  var hora=s[1];
  var fecha=dia[1]+"/"+dia[0]+"/"+dia[2]+" "+hora;
  return fecha;
}


 


  


}
