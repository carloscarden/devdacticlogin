import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TodoService } from './../../../services/todo.service';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/file/ngx';

import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';

const STORAGE_KEY = 'my_images';


@Component({
  selector: 'app-cargar-visita-escuela',
  templateUrl: './cargar-visita-escuela.page.html',
  styleUrls: ['./cargar-visita-escuela.page.scss'],
})
export class CargarVisitaEscuelaPage implements OnInit {
  images = [];

  inspeccion = {}
  constructor(
    private route: ActivatedRoute,private location: Location,private todoService: TodoService,
    private camera: Camera, private file: File, private http: HttpClient,
    private webview: WebView, private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private storage: Storage, private plt: Platform, private loadingController: LoadingController,
    private ref: ChangeDetectorRef, private filePath: FilePath) { }

  ngOnInit() {
    this.plt.ready().then(() => {
      this.loadStoredImages();
    });
  }

  loadStoredImages() {
    this.storage.get(STORAGE_KEY).then(images => {
      if (images) {
        let arr = JSON.parse(images);
        this.images = [];
        for (let img of arr) {
          let filePath = this.file.dataDirectory + img;
          let resPath = this.pathForImage(filePath);
          this.images.push({ name: img, path: resPath, filePath: filePath });
        }
      }
    });
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
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
          handler: () =>{ this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY); }
          },
          {text: 'Use Camera',
          handler: () =>{ this.takePicture(this.camera.PictureSourceType.CAMERA); }
          },
          {text: 'Cancel',
          role: 'cancel'
          }
        ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType){}



  logForm() {
    console.log(this.inspeccion);
  }

  uploadFile() {
   console.log("uploadFile");
  }

  goBack(): void {
    this.location.back();
  }

}
