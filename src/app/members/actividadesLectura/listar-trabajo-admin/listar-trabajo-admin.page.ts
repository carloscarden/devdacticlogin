import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';



/*  SERVICES */
import { ActividadesService } from './../../../_services/actividades.service';
import { Todo, TodoService } from './../../../_services/todo.service';

/*  MODELOS */
import { Inspeccion } from './../../../_models/inspeccion';

@Component({
  selector: 'app-listar-trabajo-admin',
  templateUrl: './listar-trabajo-admin.page.html',
  styleUrls: ['./listar-trabajo-admin.page.scss'],
})
export class ListarTrabajoAdminPage implements OnInit {
  url;
  tipo;
  filtroTipo=false;
  page = 0;
  maximumPages = 3;
  trabajosAdmin=[];
  size=5;


  constructor( private router:Router, private trabajosService:ActividadesService, private todoService: TodoService) { 
    this.trabajosService.getTrabajoAdministrativo(this.size,this.page)
    .subscribe(res  =>{
                 console.log("resultados");
                 this.trabajosAdmin=res.content;
                 this.maximumPages=res.totalPages-1;
                 console.log(res);
                }  
               );
  }

  ngOnInit() {

  }


  loadTrabajosAdmin(page, infiniteScroll? ) {
    if(page <= this.maximumPages){
      this.trabajosService.getTrabajoAdministrativo(this.size,page)
      .subscribe(res  =>{
                   console.log("page"); console.log(this.page);
                   this.trabajosAdmin=this.trabajosAdmin.concat(res['content']);
                   console.log(this.trabajosAdmin);
                   if(this.filtroTipo){
                     if(!(this.tipo === "")){
                        console.log("entro");
                        this.trabajosAdmin = this.trabajosAdmin.filter(items => items.tipoTrabajoAdmin.descripcion === this.tipo);
                        console.log(this.trabajosAdmin);
                     }
                    
                   }
                   
                   if (infiniteScroll) {
                    infiniteScroll.target.complete();       
                    }             
                });


    }
    
  }


  loadMore(infiniteScroll) {
    this.page++;
    console.log("load more");
    this.loadTrabajosAdmin(this.page,infiniteScroll);
    if (this.page >= this.maximumPages ) {
      infiniteScroll.target.disabled = true;
    }
  }


  filtrar(infiniteScroll?){
    console.log("filtrar");
    this.filtroTipo=true;
    this.trabajosAdmin = [];
    this.page=0;
    while(this.trabajosAdmin.length<2 && !(this.page === this.maximumPages+1)){
      this.loadTrabajosAdmin(this.page, infiniteScroll );
      console.log(this.trabajosAdmin);
      this.page++;
    }
      
  }

  onChange(newValue) {
    console.log("onChange");
    console.log(this.url);

    this.router.navigateByUrl(this.url);
  
  
  }

}
