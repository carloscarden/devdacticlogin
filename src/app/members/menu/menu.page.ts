import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  selectedPath='';
  constructor(private router:Router) { 
    this.router.events.subscribe((event:RouterEvent)=>{
      this.selectedPath=event.url;
    })
  }

  ngOnInit() {
  }

  open(page: string) {
    this.router.navigateByUrl('/menu/' + page);
  }

}
