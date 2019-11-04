import { Component, OnInit } from '@angular/core';

import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { ToastController, Platform, AlertController } from '@ionic/angular';


import { ImagenService } from './../../../_services/imagen.service';



/* MODELOS */
import { TipoTrabajoAdministrativo } from './../../../_models/tipo-trabajo-administrativo';
import { TrabajoAdministrativo } from './../../../_models/trabajo-administrativo';
import { Imagen } from './../../../_models/imagen';


/* SERVICES */
import { TrabajoAdminServiceService } from './../../../_services/trabajo-admin-service.service';
import { ActividadesService } from './../../../_services/actividades.service';
import { AuthenticationService } from './../../../_services/authentication.service';
import { Distrito } from 'src/app/_models/distrito';

@Component({
  selector: 'app-cargar-trabajo-administrativo',
  templateUrl: './cargar-trabajo-administrativo.page.html',
  styleUrls: ['./cargar-trabajo-administrativo.page.scss'],
})
export class CargarTrabajoAdministrativoPage implements OnInit {
  trabajoAdmin = new TrabajoAdministrativo();
  tiposTrabajosAdministrativos: TipoTrabajoAdministrativo[];
  actividadesSubscription: Subscription;


  esPlataformaMovil = this.plt.is('android');

  // para prod
  tiposTrabajos;

  images = [];
  imagesWeb = [];
  megasDeLosArchivos = [];
  totalMegasDeLosArchivos = 0;

  cargaCorrecta = false;
  loading = false;
  error = '';

  horasNoValidas = false;
  diaIncorrecto = false;

  horaInicio;
  horaFin;


  datePickerObj: any = {
    showTodayButton: false, // default true
    fromDate: new Date('2016-12-08'), // default null
    toDate: new Date('2100-12-28'),
    closeOnSelect: true, // default false
    setLabel: 'Aceptar',  // default 'Set'
    todayLabel: 'Hoy', // default 'Today'
    closeLabel: 'Cancelar', // default 'Close'
    dateFormat: 'DD-MM-YYYY',
    titleLabel: 'Seleccione una fecha', // default null
    monthsList: ['En', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    weeksList: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
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

  distritos: Distrito[] = [];
  pageDistrito = 0;
  maximumPages;
  distritoAfiltrar = '';
  size = 15;
  distritoSubscription: Subscription;


  constructor(
    private plt: Platform,
    private toastController: ToastController,
    private imgService: ImagenService,
    private actividadesService: ActividadesService,
    private trabajoAdminService: TrabajoAdminServiceService,
    private authenticationService: AuthenticationService,
    private alertCtrl: AlertController) {
    this.actividadesService.getDistritos(this.distritoAfiltrar, this.size, this.pageDistrito).subscribe(
      resEncuadres => {
        this.distritos = this.distritos.concat(resEncuadres['content']);
        this.pageDistrito++;
        this.maximumPages = resEncuadres.totalPages - 1;
      }
    );
  }

  ngOnInit() {
  }

  async presentAlert(msj) {
    const alert = await this.alertCtrl.create({
      header: msj,
      buttons: ['OK']
    });

    await alert.present();
  }

  onSubmit() {
    console.log('cargar');

    this.loading = true;
    const imgsConvertidas = [];
    /* convertir todas las imagenes al formato que acepta el backend */
    for (const img of this.imagesWeb) {
      const conversion = img.archivo.split(',');
      img.archivo = conversion[1];
      imgsConvertidas.push(img);
    }
    this.imagesWeb = [];
    this.trabajoAdmin.adjuntos = imgsConvertidas;




    /* formato correcto del dia mes y año */
    const inicio = this.trabajoAdmin.inicio.split('-');
    const fechaFormat = inicio[1] + '-' + inicio[0] + '-' + inicio[2];




    /* convertir la fecha de inicio al formato que acepta el backend*/
    const formatoCorrectoHoraInicio = this.parsearLaHora(this.horaInicio);
    const formatoCorrectoInicio = fechaFormat + ' ' + formatoCorrectoHoraInicio;
    this.trabajoAdmin.inicio = formatoCorrectoInicio;


    /* convertir la fecha de fin al formato correcto el backend*/
    const formatoCorrectoHoraFin = this.parsearLaHora(this.horaFin);
    const formatoCorrectoFin = fechaFormat + ' ' + formatoCorrectoHoraFin;
    this.trabajoAdmin.fin = formatoCorrectoFin;



    /********************************************************************* */

    /*  Asignarle el inspector id del usuario logueado */
    const currentUser = this.authenticationService.currentUserValue;
    this.trabajoAdmin.inspectorId = currentUser.id;

    console.log(this.trabajoAdmin);

    if (this.validarHoras(formatoCorrectoHoraInicio, formatoCorrectoHoraFin)) {
      this.trabajoAdminService.addTrabajoAdministrativo(this.trabajoAdmin).pipe(first())
        .subscribe(
          data => {
            this.loading = false;
            this.trabajoAdmin = new TrabajoAdministrativo();
            this.error = '';
            this.presentAlert('Enviado con éxito. ');
          },
          error => {
            console.log(error);
            this.presentAlert('Hubo un error, intente nuevamente. ');
            this.error = error;
            this.loading = false;
          });
    } else {
      this.presentToast('la hora fin debe de ser mayor a la hora de inicio');
      this.trabajoAdmin.inicio = null;
    }


  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.trabajoAdmin); }


  /********************************************************************************* */

  filterPorts(tipos: TipoTrabajoAdministrativo[], text: string) {
    return tipos.filter(t => {
      return t.descripcion.toLowerCase().indexOf(text) !== -1;
    });
  }

  searchPorts(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    const text = event.text.trim().toLowerCase();
    event.component.startSearch();

    // Close any running subscription.
    if (this.actividadesSubscription) {
      this.actividadesSubscription.unsubscribe();
    }

    this.actividadesSubscription = this.trabajoAdminService.getTipoTrabajoAdministrativo().subscribe(tipos => {
      // Subscription will be closed when unsubscribed manually.
      console.log('tipos');
      console.log('tipos', tipos);
      console.log('tipos', tipos._body);

      if (this.actividadesSubscription.closed) {
        return;
      }
      console.log('tipos');
      console.log('tipos', tipos);
      console.log('tipos', tipos._body);
      const valorTipos = tipos;

      event.component.items = this.filterPorts(valorTipos, text);
      event.component.endSearch();
    });
  }


  /********************************************************************************* */


  /******************************************************************************************** */





  searchDistritos(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    this.distritoAfiltrar = event.text.trim();
    event.component.startSearch();

    // Close any running subscription.
    if (this.distritoSubscription) {
      this.distritoSubscription.unsubscribe();
    }

    this.pageDistrito = 0;
    this.actividadesService.getDistritos(this.distritoAfiltrar, this.size, this.pageDistrito).subscribe(
      resEncuadres => {
        if (resEncuadres != null) {
          console.log('resEncuadres a filtrar', resEncuadres);
          event.component.items = resEncuadres['content'];
          this.maximumPages = resEncuadres.totalPages - 1;
          this.pageDistrito++;
          event.component.endSearch();
          event.component.enableInfiniteScroll();

        } else {
          console.log('no hay encuadres');
          event.component.items = [];
          this.maximumPages = -1;
          this.pageDistrito++;
          event.component.endSearch();
          event.component.endInfiniteScroll();
        }

      });

  }


  getMoreDistritos(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    // There're no more ports - disable infinite scroll.
    if (this.pageDistrito > this.maximumPages) {
      event.component.disableInfiniteScroll();
      return;
    }

    this.actividadesService.getDistritos(this.distritoAfiltrar, this.size, this.pageDistrito).subscribe(
      resEncuadres => {
        console.log('resEncuadres', resEncuadres);
        resEncuadres = event.component.items.concat(resEncuadres['content']);



        event.component.items = resEncuadres;
        event.component.endInfiniteScroll();
        this.pageDistrito++;
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




  deleteImage(imgEntry, position) {
    this.imgService.deleteImage(imgEntry, position, this.images);

  }


  /***********************  IMAGENES DE WEB ********************************************** */

  changeListener(fileLoader): void {
    fileLoader.click();
    var that = this;
    fileLoader.onchange = function () {
      var archivoWeb = fileLoader.files[0];

      // calcular la cantidad de megas del archivo
      const megaPosibleArchivo = (archivoWeb.size / 1024) / 1024;

      // sumarselo a la cantidad total que tengo de megas
      const posibleArchivoaAgregar = that.totalMegasDeLosArchivos + megaPosibleArchivo;

      if (posibleArchivoaAgregar > 4) {
        that.presentToast('El archivo supera la cantidad permitida.');
      } else {
        that.totalMegasDeLosArchivos = posibleArchivoaAgregar;
        var reader = new FileReader();
        reader.readAsDataURL(archivoWeb);
        reader.onload = (event: any) => {
          const imagenNueva = new Imagen();
          imagenNueva.nombre = archivoWeb.name;
          imagenNueva.tipo = archivoWeb.type;
          imagenNueva.archivo = event.target.result;
          that.imagesWeb.push(imagenNueva);
          // en este arreglo tengo todos los valores de los megas que puso el usuario
          that.megasDeLosArchivos.push(megaPosibleArchivo);
        };


      }

    };
  }

  deleteImageWeb(pos) {
    // Cuando borro una imagen debo sacarle tambien del total de megas que tengo 
    this.totalMegasDeLosArchivos = --this.megasDeLosArchivos[pos];

    // Borro la imagen
    this.imagesWeb.splice(pos, 1);

    // Saco la cantidad de megas que tiene el archivo
    this.megasDeLosArchivos.splice(pos, 1);
    this.presentToast('Archivo removido.');


  }


  // validar si la hora de inicio es menor a la hora de fin
  validarHoras(horaInicial, horaFinal) {

    // Append any date. Use your birthday.
    const timeInitToDate = new Date('1990-05-06T' + horaInicial + 'Z');
    const timeEndToDate = new Date('1990-05-06T' + horaFinal + 'Z');

    console.log('hora inicio', this.horaInicio);
    console.log('hora fin', this.horaFin);

    if (timeEndToDate <= timeInitToDate) {
      return false;
    } else {
      return true;
    }



  }

  parsearLaHora(unaHoraSinFormatoCorrecto) {

    const hi = unaHoraSinFormatoCorrecto.split(':');
    const hora = hi[0];
    const minutosYmeridiano = hi[1];
    let minutos = minutosYmeridiano.split(' ');
    const meridiano = minutos[1];
    minutos = minutos[0];
    let hff = hora;
    if (meridiano === 'pm') {
      let horaFinal = parseInt(hora, 10) + 12;
      if (horaFinal === 24) {
        horaFinal = 0;
      }
      hff = horaFinal.toString();
    }

    const horaParseada = hff + ':' + minutos;
    return horaParseada;


  }

  esUnaImagen(tipo) {
    const tipoLower = tipo.toLowerCase();
    return tipoLower.includes('image');
  }


  validarFechaInicio() {
    /* formato correcto del dia mes y año */
    console.log('validar fecha de inicio');


    const diaDeHoy = new Date();
    const dias = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
    const diaDeLaSemana = dias[diaDeHoy.getUTCDay()];
    let inicioDeLaSemana;
    let diaPosible;

    diaPosible = this.trabajoAdmin.inicio.split('-');
    diaPosible = new Date(diaPosible[2], diaPosible[1] - 1, diaPosible[0]);


    // quedarme con el lunes de la semana actual
    if (diaDeLaSemana !== 'lun') {
      inicioDeLaSemana = this.getMonday(diaDeHoy);
      inicioDeLaSemana = new Date(inicioDeLaSemana.getFullYear(), inicioDeLaSemana.getMonth(), inicioDeLaSemana.getDate());

    } else {
      inicioDeLaSemana = diaDeHoy;
    }

    console.log('diaPosible', diaPosible);
    console.log('inicioDeLaSemana', inicioDeLaSemana);
    console.log('diaDeHoy', diaDeHoy);

    if (diaPosible >= inicioDeLaSemana && diaPosible <= diaDeHoy) {
      this.diaIncorrecto = false;

    } else {
      this.diaIncorrecto = true;
    }
  }

  getMonday(d) {
    d = new Date(d);
    const day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

}
