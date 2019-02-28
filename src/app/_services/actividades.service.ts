import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http'

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
              private httpOtro:Http,
              private _platform: Platform ) {

        if(this._platform.is("cordova")){
          this.basepath ="http://test2.abc.gov.ar:8080";
        }
  }
  /******************************************************************************** */
             /* LICENCIAS CRUD */
  addLicencia(licencia: Licencia) {
    return this.httpOtro.post(URL+`licencias`, { licencia });
  }

  getLicencias(): Observable<any> {
    return this.httpOtro.get(URL+`licencias`);
  }
  /******************************************************************************** */
        /*  CONVOCATORIA CRUD */
  addConvocatoria(convocatoria: Convocatoria) {
    return this.http.post<any>(URL+`addConvocatoria`, { convocatoria });
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
    return this.http.post<any>(URL+`addTrabajoAdmin`, { trabajoAdmin });
  }

  getTrabajoAdministrativo(){
    return this.http.get<TrabajoAdministrativo[]>(URL+`tareaAdministrativas`);
  }

  getTipoTrabajoAdministrativo(): Observable<any>{
    return this.httpOtro.get(URL+`tiposTrabajoAdmin`);
  }
  /******************************************************************************** */
  

  
}
