import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http'

import { Observable, of } from 'rxjs';

import 'rxjs/add/observable/fromPromise';


import { Platform } from '@ionic/angular'

const URL = `http://test2.abc.gov.ar:8080/InspectoresAppSec/`;

@Injectable({
  providedIn: 'root'
})
export class VisitaServiceService {

  basepath="/api";
 

  constructor(private http: HttpClient,
              private httpOtro:Http, // este es el que me funciona en la base de datos
              private _platform: Platform ) {

        if(this._platform.is("cordova")){
          this.basepath ="test2.abc.gov.ar:8080";
        }
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
    return this.http.get(URL+`motivosVisita/all`);
  }

  getVisitas(size,page,idInspector): Observable<any>{
    /* console.log("url");
     console.log(URL+`visitas?size=${size}&page=${page} ` )   ;*/
     return this.http.get<any>(URL+`inspectores/${idInspector}/visitas?size=${size}&page=${page}&sort=ASC`); 
  }

  getVisitasByDate(size,page,idInspector, inicio, fin): Observable<any>{
    /* console.log("url");
     console.log(URL+`visitas?size=${size}&page=${page} ` )   ;*/
     return this.http.get<any>(URL+`inspectores/${idInspector}/visitas?from=${inicio}&to=${fin}size=${size}&page=${page}&sort=ASC`); 
  }


  getVisita(idVisita,idInspector): Observable<any>{
    return this.http.get<any>(URL+`inspectores/${idInspector}/visitas/${idVisita}`);

  }
  



}
