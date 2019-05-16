import { Injectable } from '@angular/core';


import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import 'rxjs/add/observable/fromPromise';


import { TrabajoAdministrativo } from '../_models/trabajo-administrativo';
import { Platform } from '@ionic/angular'

const URL = `http://test2.abc.gov.ar:8080/InspectoresAppSec/`;


@Injectable({
  providedIn: 'root'
})
export class TrabajoAdminServiceService {
  basepath="/api";
 

  constructor(private http: HttpClient,
              private _platform: Platform ) {

        if(this._platform.is("cordova")){
          this.basepath ="test2.abc.gov.ar:8080";
        }
  }

   /******************************************************************************** */
   /*  TRABAJO ADMINISTRATIVO */
   addTrabajoAdministrativo(trabajoAdmin: TrabajoAdministrativo){
      return this.http.post<any>(URL+`trabajosAdmin`,  trabajoAdmin );
   }
      
   getTrabajoAdministrativo(size,page,idInspector): Observable<any>{
      /* console.log("url");
      console.log(URL+`trabajosAdmin?size=${size}&page=${page}`);*/
      return this.http.get<any>(URL+`inspectores/${idInspector}/trabajosAdmin?size=${size}&page=${page}`);
   }

   
      
   getTrabajoAdministrativoByDate(size,page,idInspector, inicio, fin): Observable<any>{
      /* console.log("url");
      console.log(URL+`trabajosAdmin?size=${size}&page=${page}`);*/
      return this.http.get<any>(URL+`inspectores/${idInspector}/trabajosAdmin?from=${inicio}&to=${fin}&size=${size}&page=${page}`);
   }

   getTrabajoAdministrativoByTipo(size,page,idInspector,tipo){
      console.log(URL+`inspectores/${idInspector}/trabajosAdmin?tipo=${tipo}&size=${size}&page=${page}`);
      return this.http.get<any>(URL+`inspectores/${idInspector}/trabajosAdmin?tipo=${tipo}&size=${size}&page=${page}`);

   }

   getTrabajoAdministrativoByDateAndTipo(size,page,idInspector,inicio,fin,tipo){
      return this.http.get<any>(URL+`inspectores/${idInspector}/trabajosAdmin?tipo=${tipo}from=${inicio}&to=${fin}&size=${size}&page=${page}`);
 
   }
      
   getTrabajo(idTrabajoAdmin,idInspector): Observable<any> {
      /* console.log("url");
      console.log(URL+`convocatorias?size=${size}&page=${page}`);*/
      return this.http.get<any>(URL+`inspectores/${idInspector}/trabajosAdmin/${idTrabajoAdmin}`);
   }
      
   getTipoTrabajoAdministrativo(): Observable<any>{
      return this.http.get(URL+`tiposTrabajoAdmin/all`);
   }
   /******************************************************************************** */



}
