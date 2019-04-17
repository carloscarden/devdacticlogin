import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Location } from '@angular/common';

import { HttpClient } from '@angular/common/http';

/* CAMERA  */
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';

/* SELECTABLE */
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';



/* SERVICES  */
import { ImagenService } from './../../../_services/imagen.service';
import { ActividadesService } from './../../../_services/actividades.service';

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
  imgs;
  actividadesSubscription: Subscription;
  megasDeLosArchivos=[];
  totalMegasDeLosArchivos=0;

  inspeccion = {}
  constructor(
    private plt: Platform,
    private camera: Camera, private http: HttpClient,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private ref: ChangeDetectorRef,
    private imgService:  ImagenService,
    private visitaService: ActividadesService
    ) { }

  ngOnInit() {

    this.visita.idInspector=2;
    this.visita.urgente="T";
    this.visita.establecimiento = new Establecimiento();
    /*this.plt.ready().then(() => {
      this.imgService.loadStoredImages(this.images);
    });*/
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


    /* convertir la fecha de inicio al formato que acepta el backend*/
    let inicio= new Date(this.visita.inicio);
    inicio.setSeconds(3*60*60);
    let formatoCorrectoInicio=(inicio.getMonth()+1).toString()+"-"+inicio.getDate()+"-"+inicio.getFullYear()+" "+inicio.getHours()+":"+inicio.getMinutes();
    this.visita.inicio=formatoCorrectoInicio;


    /* convertir la fecha de fin al formato correcto el backend*/
    let fin= new Date(this.visita.fin);
    fin.setSeconds(3*60*60);
    let formatoCorrectoFin=(fin.getMonth()+1).toString()+"-"+fin.getDate()+"-"+fin.getFullYear()+" "+fin.getHours()+":"+fin.getMinutes();
    this.visita.fin=formatoCorrectoFin;

    this.visita.idInspector=1;
    if(this.conflicto){
      this.visita.urgente="T"
    }
    else{
      this.visita.urgente="F"
    }

    console.log(this.visita);



    this.visitaService.addVisita(this.visita).subscribe(
        data => {
          console.log(data);
           this.loading=false;
           this.visita = new VisitaEscuela();
           this.conflicto=false;
           this.visita.establecimiento = new Establecimiento();
           this.error = '';
           this.imgs=null;
           alert("Enviado correctamente");
        },
        error => {
            alert("Hubo errores");
            this.error = error;
            this.loading = false;
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


  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons:
        [
          {text: 'Load from Library',
          handler: () =>{ this.tomarFoto(this.camera.PictureSourceType.PHOTOLIBRARY); }
          },
          {text: 'Use Camera',
          handler: () =>{ this.tomarFoto(this.camera.PictureSourceType.CAMERA); }
          },
          {text: 'Cancel',
          role: 'cancel'
          }
        ]
    });
    await actionSheet.present();
  }

  tomarFoto(sourceType: PictureSourceType){
    this.imgService.takePicture(sourceType, this.images);
    this.ref.detectChanges(); // trigger change detection cycle

  }

  deleteImage(imgEntry, position) {
    this.imgService.deleteImage(imgEntry, position, this.images);
  
  }




  /***********************  IMAGENES DE WEB ********************************************** */
  changeListener($event) : void {
    var archivoWeb = $event.target.files[0];
    console.log(archivoWeb);


    //calcular la cantidad de megas del archivo
    let megaPosibleArchivo=(archivoWeb.size/1024)/1024;

    //sumarselo a la cantidad total que tengo de megas
    let posibleArchivoaAgregar=this.totalMegasDeLosArchivos+megaPosibleArchivo;


    if(posibleArchivoaAgregar>4){
       this.presentToast('El archivo supera la cantidad permitida.');
    }
    else{
       this.totalMegasDeLosArchivos=posibleArchivoaAgregar;
       var reader = new FileReader();
       reader.readAsDataURL(archivoWeb);
       reader.onload = (event: any) => {
            let imagenNueva= new Imagen();
            imagenNueva.nombre= archivoWeb.name;
            imagenNueva.tipo = archivoWeb.type;
            imagenNueva.archivo = event.target.result;
            this.imagesWeb.push(imagenNueva) ;

            // en este arreglo tengo todos los valores de los megas que puso el usuario
            this.megasDeLosArchivos.push(megaPosibleArchivo);
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
    this.imgs=null;
    console.log(this.imgs);

  }


  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.visita); }

 

}
