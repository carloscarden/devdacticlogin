import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Http } from '@angular/http';


const URL = `http://test2.abc.gov.ar:8080/InspectoresApp/`;


@Injectable({
  providedIn: 'root'
})
export class AgendaServiceService {

  constructor( private httpOtro:Http) { }

  public getEvents(): Observable<any> {
    return this.httpOtro.get(URL+`tareas`);
  }

  public getTipoActividades():  Observable<any> {
    return this.httpOtro.get(URL+`actividades`);
  }
}
