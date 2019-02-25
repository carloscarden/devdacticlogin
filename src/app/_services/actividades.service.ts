import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { HTTP } from '@ionic-native/http/ngx';
import 'rxjs/add/observable/fromPromise';


import { Licencia }  from '../_models/licencia';
import { Convocatoria }  from '../_models/convocatoria';
import { TipoConvocatoria } from '../_models/tipo-convocatoria'
import { TipoTrabajoAdministrativo }  from '../_models/tipo-trabajo-administrativo';
import { TrabajoAdministrativo } from '../_models/trabajo-administrativo';
import { NativeHttpModule, NativeHttpBackend, NativeHttpFallback } from 'ionic-native-http-connection-backend';


const URL = `http://localhost:8100/api/`;
@Injectable({
  providedIn: 'root'
})
export class ActividadesService {

  constructor(private http: HttpClient,private httpNative:HTTP) { }
  /******************************************************************************** */
             /* LICENCIAS CRUD */
  addLicencia(licencia: Licencia) {
    return this.http.post<any>(URL+`addLicencia`, { licencia });
  }

  getLicencias(): Observable<Licencia[]> {
    return this.http.get<Licencia[]>(URL+`licencias`);
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
    
    let responseData= this.httpNative.get(`http://test2.abc.gov.ar:8080/InspectoresApp/tareas`,{},{}).then(data => {

      resp =>  JSON.parse(resp.data)});
    return Observable.fromPromise(responseData);
  }
  /******************************************************************************** */
         /*  TRABAJO ADMINISTRATIVO */
  addTrabajoAdministrativo(trabajoAdmin: TrabajoAdministrativo){
    return this.http.post<any>(URL+`addTrabajoAdmin`, { trabajoAdmin });
  }

  getTrabajoAdministrativo(){
    return this.http.get<TrabajoAdministrativo[]>(URL+`tareaAdministrativas`);
  }

  getTipoTrabajoAdministrativo(): Observable<TipoTrabajoAdministrativo[]>{
    return this.http.get<TipoTrabajoAdministrativo[]>(URL+`tipoTrabajoAdmin`);
  }
  /******************************************************************************** */
  

  
}
