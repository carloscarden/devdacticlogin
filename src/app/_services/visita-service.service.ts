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


  getAllVisitas(size,idInspector, inicio, fin, motivo){

    let urlAenviar = URL+`inspectores/${idInspector}/visitas`;


   if(motivo!=null){
       urlAenviar = urlAenviar+`?motivo=${motivo}`;
       if(inicio!=null && fin!=null ){
         urlAenviar= urlAenviar+`&from=${inicio}&to=${fin}`;
       }
       urlAenviar = urlAenviar+`&size=${size}&sort=ASC`;
   }
   else{
       if(inicio!=null && fin!=null ){
          urlAenviar= urlAenviar+`?from=${inicio}&to=${fin}&size=${size}&sort=ASC`;
       }
       else{
           urlAenviar=urlAenviar+`?size=${size}&sort=ASC`;
       }
   }
   return this.http.get<any>(urlAenviar);

  }

  getVisitas(size,page,idInspector): Observable<any>{
    /* console.log("url");
     console.log(URL+`visitas?size=${size}&page=${page} ` )   ;*/
     console.log(URL+`inspectores/${idInspector}/visitas?size=${size}&page=${page}&sort=ASC`);
     return this.http.get<any>(URL+`inspectores/${idInspector}/visitas?size=${size}&page=${page}&sort=ASC`); 
  }

  getVisitasByDate(size,page,idInspector, inicio, fin): Observable<any>{
    /* console.log("url");
     console.log(URL+`visitas?size=${size}&page=${page} ` )   ;*/
     console.log(URL+`inspectores/${idInspector}/visitas?from=${inicio}&to=${fin}size=${size}&page=${page}&sort=ASC`);
     return this.http.get<any>(URL+`inspectores/${idInspector}/visitas?from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=ASC`); 
  }

  getVisitasByMotivo(size,page,idInspector,motivo){
    console.log(URL+`inspectores/${idInspector}/visitas?motivo=${motivo}&size=${size}&page=${page}&sort=ASC`);

    return this.http.get<any>(URL+`inspectores/${idInspector}/visitas?motivo=${motivo}&size=${size}&page=${page}&sort=ASC`); 


  }

  getVisitasByDateAndMotivo(size,page,idInspector, inicio, fin,motivo): Observable<any>{
    /* console.log("url");
     console.log(URL+`visitas?size=${size}&page=${page} ` )   ;*/
     console.log(URL+`inspectores/${idInspector}/visitas?motivo=${motivo}&from=${inicio}&to=${fin}size=${size}&page=${page}&sort=ASC`);
     return this.http.get<any>(URL+`inspectores/${idInspector}/visitas?motivo=${motivo}&from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=ASC`); 
  }


  getVisita(idVisita,idInspector): Observable<any>{
    return this.http.get<any>(URL+`inspectores/${idInspector}/visitas/${idVisita}`);

  }


  getEstablecimientos(cue, size, page){
    if(!cue){
      return this.http.get<any>(URL+`establecimientos/?size=${size}&page=${page}`);
    }
    else{
      return this.http.get<any>(URL+`establecimientos/?cue=${cue}&size=${size}&page=${page}`);
    }
  }
  



}
