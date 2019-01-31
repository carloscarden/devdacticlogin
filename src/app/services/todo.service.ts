import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Inspeccion } from '../inspeccion';
import { INSPECCIONES } from '../mock-inspeccion';
import { HttpClient } from '@angular/common/http';




export interface Todo {
  id: string;
  task: string;
  priority: number;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosCollection:Todo[] = [
    { id: "a", task: 'task1', priority: 1, createdAt: 1 },
    { id: "b", task: 'task2', priority: 2, createdAt: 3 },
    { id: "c", task: 'task3', priority: 3, createdAt: 4 },
    { id: "d", task: 'task4', priority: 4, createdAt: 5 },
    { id: "e", task: 'task5', priority: 5, createdAt: 6 }
  ];
  constructor(private http: HttpClient) { }

  getInspecciones(): Observable<Inspeccion[]> {
    return this.http.get<Inspeccion[]>(`http://localhost:8100/members/inspecciones`);
  }
 
  getTodo(id:number): Observable<Inspeccion> {
    return of(INSPECCIONES.find(inspeccion => inspeccion.id === id));
  }
 
  updateTodo(todo: Todo, id: string) {
    for (var i = 0; i < this.todosCollection.length; i++) {
      if(this.todosCollection[i].id==id){
          this.todosCollection[i]=todo;
      }
    }
    return this.todosCollection;
  }
 
  addInspeccion(inspeccion: Inspeccion) {
    return this.http.post<any>(`localhost:8100/users/authenticate`, { inspeccion });
  }
 
  removeTodo(id:string) {
    return this.todosCollection;
  }

}
