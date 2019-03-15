import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tarea } from "../_models/tarea";
import { Actividad } from "../_models/actividad";




const URL = `http://test2.abc.gov.ar:8080/InspectoresApp/`;


@Injectable({
  providedIn: 'root'
})
export class AgendaServiceService {

  constructor( private httpOtro:Http, private http: HttpClient) { }

  public getEvents(month, year): Observable<any> {
    console.log(URL+`inspectores/1/tareas?month=${month}&year=${year}`);
    return this.http.get<any>(URL+`inspectores/1/tareas?month=${month}&year=${year}`);
  }

  public getTipoActividades():  Observable<any> { 
    return this.http.get<Actividad>(URL+`actividades/all`);
  }

  addTarea(tarea: Tarea){

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    headers.set('Accept-Type', 'application/json; charset=utf-8');
    headers.set('Access-Control-Allow-Origin' , '*');
    headers.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, Content-Range, Content-Disposition, Content-Description');
    return this.http.post<Tarea>(`http://test2.abc.gov.ar:8080/InspectoresApp/licencias`,  tarea,{headers: headers});

  }


}
