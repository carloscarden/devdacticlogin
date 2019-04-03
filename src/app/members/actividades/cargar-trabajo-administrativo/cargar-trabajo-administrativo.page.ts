import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';

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
  cargaCorrecta = false;
  loading = false;
  error= '';
  images = [];
  imagesWeb = [];
  esPlataformaMovil=this.plt.is('android');

  constructor(
    private plt: Platform,
    private camera: Camera, private http: HttpClient,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private ref: ChangeDetectorRef,
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


    /* convertir la fecha de inicio al formato que acepta el backend*/
    let inicio= new Date(this.trabajoAdmin.inicio);
    inicio.setSeconds(3*60*60);
    let formatoCorrectoInicio=(inicio.getMonth()+1).toString()+"-"+inicio.getDate()+"-"+inicio.getFullYear()+" "+inicio.getHours()+":"+inicio.getMinutes();
    this.trabajoAdmin.inicio=formatoCorrectoInicio;


    /* convertir la fecha de fin al formato correcto el backend*/
    let fin= new Date(this.trabajoAdmin.fin);
    fin.setSeconds(3*60*60);
    let formatoCorrectoFin=(fin.getMonth()+1).toString()+"-"+fin.getDate()+"-"+fin.getFullYear()+" "+fin.getHours()+":"+fin.getMinutes();
    this.trabajoAdmin.fin=formatoCorrectoFin;

    this.trabajoAdmin.idInspector=1;

    console.log(this.trabajoAdmin);
    this.actividadesService.addTrabajoAdministrativo(this.trabajoAdmin).pipe(first())
    .subscribe(
        data => {
           this.loading=false;
           this.trabajoAdmin = new TrabajoAdministrativo();
           this.error = '';
           alert(data);
        },
        error => {
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
    this.presentToast('File removed.');

  }

}
