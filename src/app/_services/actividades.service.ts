import { Injectable } from '@angular/core';
import { Licencia }  from '../_models/licencia';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';



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

  
}
