import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Http } from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class AgendaServiceService {

  constructor( private httpOtro:Http) { }

  public getEvents(): Observable<any> {
    let data: any = [
        {
          title: 'All Day Event',
          start: '2019-02-07',
          color: "#AAC440"
        },
        {
          title: 'Long Event',
          start: '2019-02-07',
  
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2017-11-11T16:00:00',
          color: "#805459"
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2019-02-08T16:00:00'
        },
        {
          title: 'Conference',
          start: '2019-02-09',
          color: "#EE5BB0"
        },
        {
          title: 'Meeting',
          start: '2019-02-10T11:30:00',
          color: "#9EA7FF",
          end: '2017-11-12T12:30:00'
        },
        {
          title: 'Lunch',
          start: '2019-02-11T12:00:00'
        },
        {
          title: 'Meeting',
          start: '2019-02-12T14:30:00'
        },
        {
          title: 'Happy Hour',
          start: '2019-02-13T17:30:00'
        },
        {
          title: 'Dinner',
          start: '2019-02-14T20:00:00'
        },
        {
          title: 'Birthday Party',
          start: '2019-02-15T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2019-02-16'
        }
      ];

    return this.httpOtro.get(`http://test2.abc.gov.ar:8080/InspectoresApp/tareas`);
}
}
