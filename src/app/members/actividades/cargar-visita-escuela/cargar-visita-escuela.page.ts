import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Location } from '@angular/common';


import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';

import { ImagenService } from './../../../_services/imagen.service';
import { ActividadesService } from './../../../_services/actividades.service';
import { Establecimiento } from './../../../_models/establecimiento';
import { VisitaEscuela } from './../../../_models/visita-escuela';





@Component({
  selector: 'app-cargar-visita-escuela',
  templateUrl: './cargar-visita-escuela.page.html',
  styleUrls: ['./cargar-visita-escuela.page.scss'],
})
export class CargarVisitaEscuelaPage implements OnInit {
  loading = false;
  visita = new VisitaEscuela();
  error:string;
  images = [];
  establecimientos: Establecimiento[];

  inspeccion = {}
  constructor(
    private location: Location,
    private camera: Camera, private http: HttpClient,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private plt: Platform, 
    private ref: ChangeDetectorRef,
    private imgService:  ImagenService,
    private actividadService: ActividadesService
    ) { }

  ngOnInit() {
    this.plt.ready().then(() => {
      this.imgService.loadStoredImages(this.images);
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

  onSubmit() { 
    console.log("cargar");
    this.loading = true;
    let imgs64= this.imgService.convertirAb64yBorrarImgsEnMemoria(this.images);
 
    this.visita.imagenes=imgs64;

    this.actividadService.addVisita(this.visita).subscribe(
        data => {
          console.log(data);
           this.loading=false;
           this.visita = new VisitaEscuela();
           this.error = '';
           alert(data);
        },
        error => {
            this.error = error;
            this.loading = false;
        });;
  
  }



  goBack(): void {
    this.location.back();
  }

}
