import { Component, OnInit } from '@angular/core';


import { first } from 'rxjs/operators';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';



import { ToastController, Platform, AlertController } from '@ionic/angular';



/*  SERVICES */
import { ConvocatoriaServiceService } from './../../../_services/convocatoria-service.service';
import { ActividadesService } from './../../../_services/actividades.service';
import { AuthenticationService } from './../../../_services/authentication.service';


/*  MODELOS */
import { Convocatoria } from './../../../_models/convocatoria';
import { TipoConvocatoria } from './../../../_models/tipo-convocatoria';
import { Imagen } from './../../../_models/imagen';




@Component({
  selector: 'app-cargar-convocatoria',
  templateUrl: './cargar-convocatoria.page.html',
  styleUrls: ['./cargar-convocatoria.page.scss'],
})
export class CargarConvocatoriaPage implements OnInit {
  convocatoria = new Convocatoria();
  
  tiposConvocatorias: TipoConvocatoria[];
 
  actividadesSubscription: Subscription;
 
  /* manejo de las imagenes  */
  images = [];
  imagesWeb = [];
  megasDeLosArchivos=[];
  totalMegasDeLosArchivos=0;


  esPlataformaMovil=this.plt.is('android');

  /* validaciones de alta del formulario */
  cargaCorrecta = false;
  loading = false;
  error= '';
  horasNoValidas=false;

  horaInicio;
  horaFin;


  myDate;

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


  
 
  
 
  constructor(
    private plt: Platform,
    private toastController: ToastController,

    private authenticationService: AuthenticationService,
    private actividadesService: ActividadesService,
    private convocatoriaService: ConvocatoriaServiceService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    /* id del inspector */
   
    this.convocatoria.inicio=null;
  }

  async presentAlert(msj) {
    const alert = await this.alertCtrl.create({
      header: msj,
      buttons: ['OK']
    });

    await alert.present();
  }

  onSubmit() {
    this.loading = true;
    let imgsConvertidas =[];

    /* convertir todas las imagenes al formato que acepta el backend */
    for(let img of this.imagesWeb){
      let conversion= img.archivo.split(',');
      // en conversion[1] tengo la imagen
      img.archivo = conversion[1];
      imgsConvertidas.push(img);
    }
    // vacio el array de las imagenes
    this.imagesWeb=[];

    // agrego las imagenes con el formato correcto
    this.convocatoria.adjuntos=imgsConvertidas;

    
    

    /* formato correcto del dia mes y año */
    let inicio= new Date(this.convocatoria.inicio);
    let fechaFormat=(inicio.getMonth()+1).toString()+"-"+inicio.getDate()+"-"+inicio.getFullYear(); 
    
    /* convertir la fecha de inicio al formato que acepta el backend*/
    let hi= new Date(this.horaInicio);
    let formatoCorrectoInicio=fechaFormat+" "+hi.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});;
    this.convocatoria.inicio=formatoCorrectoInicio;

    /* convertir la fecha de fin al formato correcto el backend*/

    let hf= new Date(this.horaFin);
    let formatoCorrectoFin=fechaFormat+" "+hf.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    this.convocatoria.fin=formatoCorrectoFin;


     /********************************************************************* */
     let currentUser = this.authenticationService.currentUserValue;
     this.convocatoria.inspectorId=currentUser.id;


    this.convocatoriaService.addConvocatoria(this.convocatoria).pipe(first())
    .subscribe(
        data => {
           
           this.loading=false;
           this.convocatoria = new Convocatoria();
           this.horaInicio=null;
           this.horaFin=null;
           this.error = '';
           this.presentAlert("Enviado con éxito. ");
        },
        error => {
            console.log('error en el data', error);
            this.presentAlert("Hubo un error, intente nuevamente. ");
            this.error = error;
            this.loading = false;
        });;

   }

   // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.convocatoria); }



  /****************************** TIPOS CONVOCATORIAS ************************************************************ */

  filterPorts(tipos: TipoConvocatoria[], text: string) {
    return tipos.filter(t => {
      return t.descripcion.toLowerCase().indexOf(text) !== -1 ;
    });
  }

  searchPorts(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    // Close any running subscription.
    if (this.actividadesSubscription) {
      this.actividadesSubscription.unsubscribe();
    }
    this.convocatoriaService.getTipoConvocatorias();

    this.actividadesSubscription = this.convocatoriaService.getTipoConvocatorias().subscribe(tipos => {
      // Subscription will be closed when unsubscribed manually.
     /* var tareas=JSON.parse(tipos._body);*/
     if (this.actividadesSubscription.closed) {
        return;
      }

      event.component.items = this.filterPorts(tipos, text);
      event.component.endSearch();
    });
  }


  /******************************************************************************************** */


  filterDistritos(tipos: TipoConvocatoria[], text: string) {
    return tipos.filter(t => {
      return t.descripcion.toLowerCase().indexOf(text) !== -1 ;
    });
  }




  searchDistritos(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    // Close any running subscription.
    if (this.actividadesSubscription) {
      this.actividadesSubscription.unsubscribe();
    }

    this.actividadesSubscription = this.actividadesService.getDistritos().subscribe(tipos => {

      // Subscription will be closed when unsubscribed manually.
     if (this.actividadesSubscription.closed) {
        return;
      }

      event.component.items = this.filterDistritos(tipos, text);
      event.component.endSearch();
    });
  }

  /******************************************************************************************** */


  async presentToast(text) {
    const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
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
    console.log(this.horaInicio);
    console.log(this.horaFin);

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
