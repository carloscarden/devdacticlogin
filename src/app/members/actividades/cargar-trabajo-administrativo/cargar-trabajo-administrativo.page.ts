import { Component, OnInit } from '@angular/core';

import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { ToastController, Platform } from '@ionic/angular';


import { ImagenService } from './../../../_services/imagen.service';



/* MODELOS */
import { TipoTrabajoAdministrativo } from './../../../_models/tipo-trabajo-administrativo';
import { TrabajoAdministrativo } from  './../../../_models/trabajo-administrativo';
import { Imagen } from './../../../_models/imagen';


/* SERVICES */
import { ActividadesService } from './../../../_services/actividades.service';


@Component({
  selector: 'app-cargar-trabajo-administrativo',
  templateUrl: './cargar-trabajo-administrativo.page.html',
  styleUrls: ['./cargar-trabajo-administrativo.page.scss'],
})
export class CargarTrabajoAdministrativoPage implements OnInit {
  trabajoAdmin = new TrabajoAdministrativo();
  tiposTrabajosAdministrativos: TipoTrabajoAdministrativo[];
  actividadesSubscription: Subscription;
  
  
  esPlataformaMovil=this.plt.is('android');

  images = [];
  imagesWeb = [];
  megasDeLosArchivos=[];
  totalMegasDeLosArchivos=0;

  cargaCorrecta = false;
  loading = false;
  error= '';

  horaInicio;
  horaFin;
  
  constructor(
    private plt: Platform,
    private toastController: ToastController,
    private imgService:  ImagenService,
    private actividadesService: ActividadesService) { }

  ngOnInit() {
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
    this.trabajoAdmin.adjuntos=imgsConvertidas;


    

    /* formato correcto del dia mes y año */
    let inicio= new Date(this.trabajoAdmin.inicio);
    let fechaFormat=(inicio.getMonth()+1).toString()+"-"+inicio.getDate()+"-"+inicio.getFullYear(); 




    /* convertir la fecha de inicio al formato que acepta el backend*/
    let hi= new Date(this.horaInicio);
    let formatoCorrectoInicio=fechaFormat+" "+hi.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    this.trabajoAdmin.inicio=formatoCorrectoInicio;


    /* convertir la fecha de fin al formato correcto el backend*/
    let hf= new Date(this.horaFin);
    let formatoCorrectoFin=fechaFormat+" "+hf.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    this.trabajoAdmin.fin=formatoCorrectoFin;

    this.trabajoAdmin.idInspector=1;

   /********************************************************************* */


    console.log(this.trabajoAdmin);
    this.actividadesService.addTrabajoAdministrativo(this.trabajoAdmin).pipe(first())
    .subscribe(
        data => {
           this.loading=false;
           this.trabajoAdmin = new TrabajoAdministrativo();
           this.horaInicio=null;
           this.horaFin=null;
           this.error = '';
           alert("Enviado correctamente");
        },
        error => {
          alert("Hubo errores");
            this.error = error;
            this.loading = false;
        });;
  
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.trabajoAdmin); }


  filterPorts(tipos: TipoTrabajoAdministrativo[], text: string) {
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

    this.actividadesSubscription = this.actividadesService.getTipoTrabajoAdministrativo().subscribe(tipos => {
      // Subscription will be closed when unsubscribed manually.
     if (this.actividadesSubscription.closed) {
        return;
      }
      console.log("tipos");
      let valorTipos=JSON.parse(tipos._body);
      event.component.items = this.filterPorts(valorTipos, text);
      event.component.endSearch();
    });
  }




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

}
