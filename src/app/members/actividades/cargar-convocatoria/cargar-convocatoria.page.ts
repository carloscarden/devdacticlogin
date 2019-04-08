import { Component, OnInit , ChangeDetectorRef} from '@angular/core';


import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';

import { Location } from '@angular/common';


import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';

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
  images = [];
  imagesWeb = [];
  actividadesSubscription: Subscription;
  cargaCorrecta = false;
  loading = false;
  error= '';
  esPlataformaMovil=this.plt.is('android');
 
  constructor(
    private plt: Platform,
    private camera: Camera, private http: HttpClient,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private ref: ChangeDetectorRef,
    private imgService:  ImagenService,
    private convocatoriaService: ActividadesService,
    private route: ActivatedRoute,
    private router: Router,) { }

  ngOnInit() {
    /* id del inspector */
    this.convocatoria.idInspector=1;
  }

  onSubmit() {
    this.loading = true;
    let imgs64= this.imgService.convertirAb64yBorrarImgsEnMemoria(this.images);
    let imgsConvertidas =[];

    /* convertir todas las imagenes al formato que acepta el backend */
    for(let img of this.imagesWeb){
      let conversion= img.archivo.split(',');
      img.archivo = conversion[1];
      imgsConvertidas.push(img);
    }
    this.imagesWeb=[];
    this.convocatoria.adjuntos=imgsConvertidas;


    /* convertir la fecha de inicio al formato que acepta el backend*/
    let inicio= new Date(this.convocatoria.inicio);
    inicio.setSeconds(3*60*60);
    let formatoCorrectoInicio=(inicio.getMonth()+1).toString()+"-"+inicio.getDate()+"-"+inicio.getFullYear()+" "+inicio.getHours()+":"+inicio.getMinutes();
    this.convocatoria.inicio=formatoCorrectoInicio;


    /* convertir la fecha de fin al formato correcto el backend*/
    let fin= new Date(this.convocatoria.fin);
    fin.setSeconds(3*60*60);
    let formatoCorrectoFin=(fin.getMonth()+1).toString()+"-"+fin.getDate()+"-"+fin.getFullYear()+" "+fin.getHours()+":"+fin.getMinutes();
    this.convocatoria.fin=formatoCorrectoFin;

    


    console.log(this.convocatoria);
    this.convocatoriaService.addConvocatoria(this.convocatoria).pipe(first())
    .subscribe(
        data => {
           
           this.loading=false;
           this.convocatoria = new Convocatoria();
           this.error = '';
           alert(data);
        },
        error => {
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


  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Seleccione ",
      buttons:
        [
          {text: 'Cargar',
          handler: () =>{ this.tomarFoto(this.camera.PictureSourceType.PHOTOLIBRARY); }
          },
          {text: 'Usar cámara',
          handler: () =>{ this.tomarFoto(this.camera.PictureSourceType.CAMERA); }
          },
          {text: 'Cancelar',
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


  changeListener($event) : void {
    var archivoWeb = $event.target.files[0];
    console.log(archivoWeb);

     /*
    megasArchivo=(archivoWeb.size/1024)/1024;
    if(megasArchivo>4){
        this.presentToast('El archivo supera la cantidad permitida.');
    }
    else{}
    */
    

    var reader = new FileReader();
    reader.readAsDataURL(archivoWeb);
    reader.onload = (event: any) => {
        let imagenNueva= new Imagen();
        imagenNueva.nombre= archivoWeb.name;
        imagenNueva.tipo = archivoWeb.type;
        imagenNueva.archivo = event.target.result;
        this.imagesWeb.push(imagenNueva) ;
    }
            
  }

  deleteImageWeb(pos){
    this.imagesWeb.splice(pos, 1);
    this.presentToast('Archivo removido.');

  }


  





}
