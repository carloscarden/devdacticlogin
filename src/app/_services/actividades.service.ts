import { Injectable } from '@angular/core';
import { Licencia }  from '../_models/licencia';
import { Convocatoria }  from '../_models/convocatoria';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TipoTrabajoAdministrativo }  from '../_models/tipo-trabajo-administrativo';


@Injectable({
  providedIn: 'root'
})
export class ActividadesService {

  constructor(private http: HttpClient) { }

             /* LICENCIAS CRUD */
  addLicencia(licencia: Licencia) {
    return this.http.post<any>(`http://localhost:8100/members/licencias/addLicencia`, { licencia });
  }

  getLicencias(): Observable<Licencia[]> {
    return this.http.get<Licencia[]>(`http://localhost:8100/members/licencias`);
  }

        /*  CONVOCATORIA CRUD */
  addConvocatoria(convocatoria: Convocatoria) {
    return this.http.post<any>(`http://localhost:8100/members/convocatorias/addConvocatoria`, { convocatoria });
  }

         /*  TRABAJO ADMINISTRATIVO */
  addTrabajoAdministrativo(){}

  getTrabajoAdministrativo(){}

  getTipoTrabajoAdministrativo(): Observable<TipoTrabajoAdministrativo[]>{
    return this.http.get<TipoTrabajoAdministrativo[]>(`http://localhost:8100/members/tipoTrabajoAdmin`);
  }

  
}
