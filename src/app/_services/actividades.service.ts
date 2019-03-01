import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http,Headers ,RequestOptions } from '@angular/http'

import { Observable, of } from 'rxjs';

import 'rxjs/add/observable/fromPromise';


import { Licencia }  from '../_models/licencia';
import { Convocatoria }  from '../_models/convocatoria';
import { TipoConvocatoria } from '../_models/tipo-convocatoria'
import { TipoTrabajoAdministrativo }  from '../_models/tipo-trabajo-administrativo';
import { TrabajoAdministrativo } from '../_models/trabajo-administrativo';
import { Platform } from '@ionic/angular'

const URL = `http://test2.abc.gov.ar:8080/InspectoresApp/`;
@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  basepath="/api";
 

  constructor(private http: HttpClient,
              private httpOtro:Http, // este es el que me funciona en la base de datos
              private _platform: Platform ) {

        if(this._platform.is("cordova")){
          this.basepath ="http://test2.abc.gov.ar:8080";
        }
  }
  /******************************************************************************** */
             /* LICENCIAS CRUD */
  addLicencia(licencia: any) {

    var l={
      "inicio":"2018-12-12",
      "fin":"2018-12-12",
      "codigo":"lalala",
      "inspector":{
            "id":2,
            "nombre":"Guye",
            "apellido":"No tiene"
        }
      };
  /* var headers = new Headers();
   

    return this.httpOtro.post(URL+`licencias`,  l );*/

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    headers.set('Accept-Type', 'application/json; charset=utf-8');
    headers.set('Access-Control-Allow-Origin' , '*');
    headers.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, Content-Range, Content-Disposition, Content-Description');
    return this.http.post<any>(this.basepath+"/licencias",  licencia,{headers: headers});
  }

  getLicencias(): Observable<any> {
    return this.httpOtro.get(URL+`licencias`);
  }
  /******************************************************************************** */
        /*  CONVOCATORIA CRUD */
  addConvocatoria(convocatoria: Convocatoria) {
    return this.http.post<any>(this.basepath+`addConvocatoria`, { convocatoria });
  }

  getConvocatorias(): Observable<Convocatoria[]> {
    return this.http.get<Convocatoria[]>(URL+`convocatorias`);
  }

  getTipoConvocatorias(): Observable<any>{
    return this.httpOtro.get(URL+`tiposConvocatoria`);

  }
  /******************************************************************************** */
         /*  TRABAJO ADMINISTRATIVO */
  addTrabajoAdministrativo(trabajoAdmin: TrabajoAdministrativo){
    return this.http.post<any>(URL+`addTrabajoAdmin`,  trabajoAdmin );
  }

  getTrabajoAdministrativo(){
    return this.http.get<TrabajoAdministrativo[]>(URL+`tareaAdministrativas`);
  }

  getTipoTrabajoAdministrativo(): Observable<any>{
    return this.httpOtro.get(URL+`tiposTrabajoAdmin`);
  }
  /******************************************************************************** */
  

  
}
