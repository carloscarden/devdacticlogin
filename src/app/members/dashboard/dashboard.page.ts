import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../services/authentication.service';
import { Todo, TodoService } from './../../services/todo.service';
import { Inspeccion } from './../../inspeccion';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  inspecciones: Inspeccion[];


  constructor(private authService: AuthenticationService,private todoService: TodoService) { }

  ngOnInit() {
    this.todoService.getTodos()
      .subscribe(inspecciones => this.inspecciones = inspecciones);
  }

  remove(item:Todo) {
    this.todoService.removeTodo(item.id);
  }


  logout() {
    this.authService.logout();
  }

}
