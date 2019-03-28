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
          this.basepath ="test2.abc.gov.ar:8080";
        }
  }
  /******************************************************************************** */
             /* LICENCIAS CRUD */
  addLicencia(licencia: any) {

  /* var headers = new Headers();
    return this.httpOtro.post(URL+`licencias`,  l );*/
    console.log(licencia);

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    headers.set('Accept-Type', 'application/json; charset=utf-8');
    headers.set('Access-Control-Allow-Origin' , '*');
    headers.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, Content-Range, Content-Disposition, Content-Description');
    return this.http.post<any>(`http://test2.abc.gov.ar:8080/InspectoresApp/licencias`, licencia,{headers: headers});
  }

  getLicencias(size,page): Observable<any> {
    console.log("url");
    console.log(URL+`licencias?size=${size}&page=${page}`);
    return this.http.get<any>(URL+`licencias?size=${size}&page=${page}&sort=ASC`);
  }
  /******************************************************************************** */
        /*  CONVOCATORIA CRUD */
  addConvocatoria(convocatoria: Convocatoria) {
    return this.http.post<any>(URL+`convocatorias`,  convocatoria );
  }

  getConvocatorias(size,page): Observable<any> {
    console.log("url");
    console.log(URL+`convocatorias?size=${size}&page=${page}`);
    return this.http.get<any>(URL+`convocatorias?size=${size}&page=${page}&sort=ASC`);
  }

  getTipoConvocatorias(): Observable<any>{
    return this.http.get(URL+`tiposConvocatoria/all`);

  }


  getDistritos(): Observable<any>{
    return this.httpOtro.get(URL+`distritos`);

  }
  /******************************************************************************** */
         /*  TRABAJO ADMINISTRATIVO */
  addTrabajoAdministrativo(trabajoAdmin: TrabajoAdministrativo){
    return this.http.post<any>(URL+`trabajosAdmin`,  trabajoAdmin );
  }

  getTrabajoAdministrativo(size,page): Observable<any>{
    console.log("url");
    console.log(URL+`trabajosAdmin?size=${size}&page=${page}`);
    return this.http.get<any>(URL+`trabajosAdmin?size=${size}&page=${page}`);
  }

  getTipoTrabajoAdministrativo(): Observable<any>{
    return this.httpOtro.get(URL+`tiposTrabajoAdmin/all`);
  }
  /******************************************************************************** */

  addVisita(visita: any){

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    headers.set('Accept-Type', 'application/json; charset=utf-8');
    headers.set('Access-Control-Allow-Origin' , '*');
    headers.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, Content-Range, Content-Disposition, Content-Description');
    return this.http.post<any>(URL+`visitas`,  visita,{headers: headers});

  }

  getMotivosVisitas(): Observable<any>{
    return this.http.get(URL+`motivosVisitas/all`);
  }

  getVisitas(size,page): Observable<any>{
     console.log("url");
     console.log(URL+`visitas?size=${size}&page=${page} ` )   ;
     return this.http.get<any>(URL+`visitas?size=${size}&page=${page}&sort=ASC`); 
  }
  

  
}
