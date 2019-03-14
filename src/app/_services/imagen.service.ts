import { Injectable , ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/file/ngx';

import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';

const STORAGE_KEY = 'my_images';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  constructor(
    private route: ActivatedRoute,private location: Location,
    private camera: Camera, private file: File, private http: HttpClient,
    private webview: WebView, private actionSheetController: ActionSheetController,
    private storage: Storage, private plt: Platform, private loadingController: LoadingController,
    private ref: ChangeDetectorRef, private filePath: FilePath,
    private toastController: ToastController
    ) { }


   loadStoredImages(img) {
        this.storage.get(STORAGE_KEY).then(images => {
          if (img) {
            let arr = JSON.parse(images);
            img = [];
            for (let img of arr) {
              let filePath = this.file.dataDirectory + img;
              let resPath = this.pathForImage(filePath);
              img.push({ name: img, path: resPath, filePath: filePath });
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


  takePicture(sourceType: PictureSourceType, imgs) {
    var options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true
    };
 
    this.camera.getPicture(options).then(imagePath => {
        if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
            this.filePath.resolveNativePath(imagePath)
                .then(filePath => {
                    let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                    let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                    this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), imgs);
                });
        } else {
            var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
            var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), imgs);
        }
    });
 
   }

 createFileName() {
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
    return newFileName;
}

async presentToast(text) {
  const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
  });
  toast.present();
}

   copyFileToLocalDir(namePath, currentName, newFileName, img) {
      this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
          this.updateStoredImages(newFileName, img);
      }, error => {
          this.presentToast('Error while storing file.');
      });
    }


    updateStoredImages(name, img) {
      this.storage.get(STORAGE_KEY).then(images => {
          let arr = JSON.parse(images);
          if (!arr) {
              let newImages = [name];
              this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
          } else {
              arr.push(name);
              this.storage.set(STORAGE_KEY, JSON.stringify(arr));
          }
   
          let filePath = this.file.dataDirectory + name;
          let resPath = this.pathForImage(filePath);
   
          let newEntry = {
              name: name,
              path: resPath,
              filePath: filePath
          };
   
          img = [newEntry, ... img];
          
      });
  }


  deleteImage(imgEntry, position, imgs) {
    imgs.splice(position, 1);
 
    this.storage.get(STORAGE_KEY).then(images => {
        let arr = JSON.parse(images);
        let filtered = arr.filter(name => name != imgEntry.name);
        this.storage.set(STORAGE_KEY, JSON.stringify(filtered));
 
        var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);
 
        this.file.removeFile(correctPath, imgEntry.name).then(res => {
            this.presentToast('File removed.');
        });
    });
  }


  convertToBase64(imgs){
    this.file.resolveLocalFilesystemUrl(imgs.filePath)
    .then(entry => {
        ( < FileEntry > entry).file(file => this.readFile(file))
    })
    .catch(err => {
        this.presentToast('Error while reading file.');
    });
  }

  readFile(file: any) {
    console.log("fileReader");
    var fileReader = new FileReader();
    var fileToLoad =file;
    fileReader.onload = function(fileLoadedEvent) {
        var srcData = fileReader.result+''; // <--- data: base64
        console.log("Converted Base64 version is " + srcData);
        var comoLoQuiereJuancito = srcData.split(',');
        return comoLoQuiereJuancito;
    }

    fileReader.readAsDataURL(fileToLoad);
    console.log("func readAsDataURL");
    console.log(fileToLoad);
  }

  convertirAb64yBorrarImgsEnMemoria(images){
    let imgs64=[];
    while (images.length!=0){
      let img = images.pop();
      let img64= this.convertToBase64(img);
      imgs64.push(img64);
      this.deleteImage(img, 0, images);
    }

    return imgs64;
  }
  

}
