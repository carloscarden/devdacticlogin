import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http'

import { Observable, of } from 'rxjs';

import 'rxjs/add/observable/fromPromise';


import { Convocatoria }  from '../_models/convocatoria';
import { Platform } from '@ionic/angular'


const URL = `http://test2.abc.gov.ar:8080/InspectoresAppSec/`;


@Injectable({
  providedIn: 'root'
})
export class ConvocatoriaServiceService {

  basepath="/api";
 

  constructor(private http: HttpClient,
              private httpOtro:Http, // este es el que me funciona en la base de datos
              private _platform: Platform ) {

        if(this._platform.is("cordova")){
          this.basepath ="test2.abc.gov.ar:8080";
        }
  }


  /*  CONVOCATORIA CRUD */
  addConvocatoria(convocatoria: Convocatoria) {
      return this.http.post<any>(URL+`convocatorias`,  convocatoria );
  }
      
  getConvocatorias(size,page,idInspector): Observable<any> {
     /* console.log("url");
     console.log(URL+`convocatorias?size=${size}&page=${page}`);*/
     return this.http.get<any>(URL+`inspectores/${idInspector}/convocatorias?size=${size}&page=${page}&sort=ASC`);
  }
      
  getConvocatoriasByDate(size,page,idInspector, inicio, fin): Observable<any> {
     /* console.log("url");
     console.log(URL+`convocatorias?size=${size}&page=${page}`);*/
     return this.http.get<any>(URL+`inspectores/${idInspector}/convocatorias?from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=ASC`);
  }
      
  getConvocatoria(idConvocatoria,idInspector): Observable<any> {
     /* console.log("url");
     console.log(URL+`convocatorias?size=${size}&page=${page}`);*/
     return this.http.get<any>(URL+`inspectores/${idInspector}/convocatorias/${idConvocatoria}`);
  }
      
  getTipoConvocatorias(): Observable<any>{
     return this.http.get(URL+`tiposConvocatoria/all`);
  }
      



}
