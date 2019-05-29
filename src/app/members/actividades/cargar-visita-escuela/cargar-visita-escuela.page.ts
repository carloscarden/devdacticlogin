import { Component, OnInit } from '@angular/core';



/* CAMERA  */
import {  ToastController, AlertController} from '@ionic/angular';

/* SELECTABLE */
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';



/* SERVICES  */
import { ImagenService } from './../../../_services/imagen.service';
import { VisitaServiceService } from './../../../_services/visita-service.service';
import { AuthenticationService } from './../../../_services/authentication.service';


/* MODELS  */
import { Establecimiento } from './../../../_models/establecimiento';
import { VisitaEscuela } from './../../../_models/visita-escuela';
import { MotivoVisita } from './../../../_models/motivo-visita';
import { Imagen } from './../../../_models/imagen';






@Component({
  selector: 'app-cargar-visita-escuela',
  templateUrl: './cargar-visita-escuela.page.html',
  styleUrls: ['./cargar-visita-escuela.page.scss'],
})
export class CargarVisitaEscuelaPage implements OnInit {
  loading = false;
  visita = new VisitaEscuela();
  motivosVisita: MotivoVisita[];
  error:string;
  images = [];
  imagesWeb = [];
  conflicto=false;
  actividadesSubscription: Subscription;
  megasDeLosArchivos=[];
  totalMegasDeLosArchivos=0;
  horasNoValidas=false;

  horaInicio;
  horaFin;


  datePickerObj: any = {
    showTodayButton: false, // default true
    fromDate: new Date('2016-12-08'), // default null
    toDate: new Date('2100-12-28'),
    closeOnSelect: true, // default false
    setLabel: 'Aceptar',  // default 'Set'
    todayLabel: 'Hoy', // default 'Today'
    closeLabel: 'Cancelar', // default 'Close'
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


  inspeccion = {}
  constructor(
    private toastController: ToastController,
    private imgService:  ImagenService,
    private visitaService: VisitaServiceService,
    private authenticationService: AuthenticationService,
    private alertCtrl: AlertController
    ) { }

  ngOnInit() {

    this.visita.urgente="T";
    this.visita.establecimiento = new Establecimiento();
    /*this.plt.ready().then(() => {
      this.imgService.loadStoredImages(this.images);
    });*/
  }

  async presentAlert(msj) {
    const alert = await this.alertCtrl.create({
      header: msj,
      buttons: ['OK']
    });

    await alert.present();
  }


  onSubmit() { 
    console.log("cargar");
    this.loading = true;
    let imgsConvertidas =[];
    /* convertir todas las imagenes al formato que acepta el backend */
    for(let img of this.imagesWeb){
      let conversion= img.archivo.split(',');
      img.archivo = conversion[1];
      imgsConvertidas.push(img);
    }
    this.imagesWeb=[];
    this.visita.adjuntos=imgsConvertidas;


   /* formato correcto del dia mes y año */
    let inicio= new Date(this.visita.inicio);
    let fechaFormat=(inicio.getMonth()+1).toString()+"-"+inicio.getDate()+"-"+inicio.getFullYear(); 

    /* convertir la fecha de inicio al formato que acepta el backend*/
    let hi= new Date(this.horaInicio);
    let formatoCorrectoInicio=fechaFormat+" "+hi.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    this.visita.inicio=formatoCorrectoInicio;


    /* convertir la fecha de fin al formato correcto el backend*/
    let hf= new Date(this.horaFin);
    let formatoCorrectoFin=fechaFormat+" "+hf.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    this.visita.fin=formatoCorrectoFin;
    /* ******************************************************************** */
    
    if(this.conflicto){
      this.visita.urgente="T"
    }
    else{
      this.visita.urgente="F"
    }

    

    let currentUser = this.authenticationService.currentUserValue;
    this.visita.inspectorId=currentUser.id;
    console.log("visita escuela a mandar",this.visita);


    this.visitaService.addVisita(this.visita).subscribe(
        data => {
          console.log(data);
           this.loading=false;
           this.visita = new VisitaEscuela();
           this.conflicto=false;
           this.visita.establecimiento = new Establecimiento();
           this.error = '';
           this.horaInicio=null;
           this.horaFin=null;
           this.presentAlert("Enviado con éxito.  ");
        },
        error => {
           console.log("error",error);
           if(error=="Entidad Improcesable"){
            this.presentAlert("El cue es incorrecto. ");
           } else{
            this.presentAlert("Hubo un error, intente nuevamente. ");
           }
           console.log("error",error);

           this.loading=false;
           this.visita = new VisitaEscuela();
           this.conflicto=false;
           this.visita.establecimiento = new Establecimiento();
           this.error = '';
           this.horaInicio=null;
           this.horaFin=null;
           this.error = error;
        });;
  
  }



  /*****************  MOTIVOS SELECTABLE   ********************************** */
  
  filterPorts(tipos: MotivoVisita[], text: string) {
    return tipos.filter(t => {
      return t.descripcion.toLowerCase().indexOf(text) !== -1 ;
    });
  }

  searchMotivos (event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    // Close any running subscription.
    if (this.actividadesSubscription) {
      this.actividadesSubscription.unsubscribe();
    }

    this.actividadesSubscription = this.visitaService.getMotivosVisitas().subscribe(tipos => {
      // Subscription will be closed when unsubscribed manually.
     if (this.actividadesSubscription.closed) {
        return;
      }
      console.log("tipos");
      console.log(tipos);

      event.component.items = this.filterPorts(tipos, text);
      event.component.endSearch();
    });
  }

  /****************************************************************************************** */




  /***********************  IMAGENES DE MOVIL ********************************************** */
  async presentToast(text) {
    const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }



  deleteImage(imgEntry, position) {
    this.imgService.deleteImage(imgEntry, position, this.images);
  
  }




  /***********************  IMAGENES DE WEB ********************************************** */
  changeListener(fileLoader) : void {
    fileLoader.click();
    var that = this;
    fileLoader.onchange = function () {
      var archivoWeb = fileLoader.files[0];
      
       //calcular la cantidad de megas del archivo
      let megaPosibleArchivo=(archivoWeb.size/1024)/1024;

       //sumarselo a la cantidad total que tengo de megas
     let posibleArchivoaAgregar=that.totalMegasDeLosArchivos+megaPosibleArchivo;

     if(posibleArchivoaAgregar>4){
        that.presentToast('El archivo supera la cantidad permitida.');
      }
      else{
        that.totalMegasDeLosArchivos=posibleArchivoaAgregar;
        var reader = new FileReader();
        reader.readAsDataURL(archivoWeb);
        reader.onload = (event: any) => {
          let imagenNueva= new Imagen();
          imagenNueva.nombre= archivoWeb.name;
          imagenNueva.tipo = archivoWeb.type;
          imagenNueva.archivo = event.target.result;
          that.imagesWeb.push(imagenNueva) ;
          // en este arreglo tengo todos los valores de los megas que puso el usuario
          that.megasDeLosArchivos.push(megaPosibleArchivo);
        }


      }

    }      
            
  }

  deleteImageWeb(pos){

    // Cuando borro una imagen debo sacarle tambien del total de megas que tengo 
    this.totalMegasDeLosArchivos=--this.megasDeLosArchivos[pos];

    // Borro la imagen
    this.imagesWeb.splice(pos, 1);

    // Saco la cantidad de megas que tiene el archivo
    this.megasDeLosArchivos.splice(pos,1);
    this.presentToast('Archivo removido.');


  }


   // validar si la hora de inicio es menor a la hora de fin
   validarHoras(){

    if(this.horaInicio!=null){
      if(this.horaFin!=null){
           if(this.horaFin<this.horaInicio){
             this.horasNoValidas=true;
           }
           else{
             this.horasNoValidas=false;
           }
      }
    }

  }


  esUnaImagen(tipo){
    let tipoLower=tipo.toLowerCase();
    return tipoLower.includes("image");
  }

 

}
