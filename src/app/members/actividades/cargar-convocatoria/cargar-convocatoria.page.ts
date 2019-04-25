import { Component, OnInit , ChangeDetectorRef} from '@angular/core';


import { first } from 'rxjs/operators';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';



import { ToastController, Platform } from '@ionic/angular';


import { ImagenService } from './../../../_services/imagen.service';

/*  SERVICES */
import { ActividadesService } from './../../../_services/actividades.service';

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

  horaInicio;
  horaFin;


  
 
  
 
  constructor(
    private plt: Platform,
    private toastController: ToastController,
    private imgService:  ImagenService,
    private convocatoriaService: ActividadesService,
  ) { }

  ngOnInit() {
    /* id del inspector */
    this.convocatoria.idInspector=1;
    this.convocatoria.inicio=null;
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




    console.log(this.convocatoria);
    this.convocatoriaService.addConvocatoria(this.convocatoria).pipe(first())
    .subscribe(
        data => {
           
           this.loading=false;
           this.convocatoria = new Convocatoria();
           this.horaInicio=null;
           this.horaFin=null;
           this.error = '';
           alert("Enviado correctamente");
        },
        error => {
            alert("Hubo errores al cargar la convocatoria");
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
    this.convocatoriaService.getTipoConvocatorias();

    this.actividadesSubscription = this.convocatoriaService.getDistritos().subscribe(tipos => {
      // Subscription will be closed when unsubscribed manually.
    
     var tareas=JSON.parse(tipos._body);
     if (this.actividadesSubscription.closed) {
        return;
      }

      event.component.items = this.filterDistritos(tareas, text);
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



  





}
