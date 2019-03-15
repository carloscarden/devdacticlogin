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




@Component({
  selector: 'app-cargar-convocatoria',
  templateUrl: './cargar-convocatoria.page.html',
  styleUrls: ['./cargar-convocatoria.page.scss'],
})
export class CargarConvocatoriaPage implements OnInit {
  convocatoria = new Convocatoria();
  tiposConvocatorias: TipoConvocatoria[];
  images = [];
  actividadesSubscription: Subscription;
  cargaCorrecta = false;
  loading = false;
  error= '';
  constructor(
    
    private location: Location,
    private camera: Camera, private http: HttpClient,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private plt: Platform, 
    private ref: ChangeDetectorRef,
    private imgService:  ImagenService,
    private convocatoriaService: ActividadesService,) { }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;
    let imgs64= this.imgService.convertirAb64yBorrarImgsEnMemoria(this.images);
  

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


  filterPorts(tipos: TipoConvocatoria[], text: string) {
    console.log(tipos);
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
      var tareas=JSON.parse(tipos._body);
     if (this.actividadesSubscription.closed) {
        return;
      }

      event.component.items = this.filterPorts(tareas, text);
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


  





}
