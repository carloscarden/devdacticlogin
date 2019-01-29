import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../services/authentication.service';
import { Todo, TodoService } from './../../services/todo.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  todos: Todo[];


  constructor(private authService: AuthenticationService,private todoService: TodoService) { }

  ngOnInit() {
    this.todos=this.todoService.getTodos();
  }

  remove(item:Todo) {
    this.todoService.removeTodo(item.id);
  }


  logout() {
    this.authService.logout();
  }

}
