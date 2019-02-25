import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


import { Licencia }  from '../_models/licencia';
import { Convocatoria }  from '../_models/convocatoria';
import { TipoConvocatoria } from '../_models/tipo-convocatoria'
import { TipoTrabajoAdministrativo }  from '../_models/tipo-trabajo-administrativo';
import { TrabajoAdministrativo } from '../_models/trabajo-administrativo';


const URL = `http://localhost:8100/members/`;
@Injectable({
  providedIn: 'root'
})
export class ActividadesService {

  constructor(private http: HttpClient) { }
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

  getTipoConvocatorias(): Observable<TipoConvocatoria[]>{
    return this.http.get<TipoConvocatoria[]>(URL+`tipoConvocatorias`);
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
