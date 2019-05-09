import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import 'rxjs/add/observable/fromPromise';


import { Platform } from '@ionic/angular'

const URL = `http://test2.abc.gov.ar:8080/InspectoresAppSec/`;



@Injectable({
  providedIn: 'root'
})
export class LicenciaServiceService {
  basepath="/api";
 

  constructor(private http: HttpClient,
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
            
     const headers = new HttpHeaders();
     headers.set('Content-Type', 'application/json; charset=utf-8');
     headers.set('Accept-Type', 'application/json; charset=utf-8');
     headers.set('Access-Control-Allow-Origin' , '*');
     headers.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
     headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, Content-Range, Content-Disposition, Content-Description');
     return this.http.post<any>(URL+`licencias`, licencia,{headers: headers});
  }
            
  getLicencias(size,page,idInspector): Observable<any> {
      /* console.log("url");
      console.log(URL+`licencias?size=${size}&page=${page}`);*/
      return this.http.get<any>(URL+`inspectores/${idInspector}/licencias?size=${size}&page=${page}&sort=ASC`);
  }
            
  getLicenciasByDate(size,page,idInspector,inicio,fin): Observable<any> {
      
      console.log(URL+`inspectores/${idInspector}/licencias?from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=ASC`);
      return this.http.get<any>(URL+`inspectores/${idInspector}/licencias?from=${inicio}&to=${fin}&size=${size}&page=${page}&sort=ASC`);
  }
            
  getLicencia(idLicencia,idInspector): Observable<any>{
     return this.http.get<any>(URL+`inspectores/${idInspector}/licencias/${idLicencia}`);
  }
  /******************************************************************************** */


}
