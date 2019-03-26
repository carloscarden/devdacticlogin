import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


/* SERVICES */
import { Todo, TodoService } from './../../../_services/todo.service';
import { ActividadesService } from './../../../_services/actividades.service';

/* MODELS */
import { Inspeccion } from './../../../_models/inspeccion';
import { Licencia } from './../../../_models/licencia';
import { Pagina } from './../../../_models/pagina';

@Component({
  selector: 'app-listar-licencia',
  templateUrl: './listar-licencia.page.html',
  styleUrls: ['./listar-licencia.page.scss'],
})
export class ListarLicenciaPage implements OnInit {
  url;
  pagLicencia: Pagina;
  page = 0;
  maximumPages = 3;
  licencias=[];
  size=5

  constructor( private router:Router,
    private todoService: TodoService,
    private licenciaService:ActividadesService,
    private httpClient: HttpClient ) { 
      this.licenciaService.getLicencias(this.size,this.page)
      .subscribe(res  =>{
                   console.log("resultados");
                   this.licencias=res.content;
                   this.maximumPages=res.totalPages-1;
                   console.log(res);
                  }  
                 );
    }

    


  ngOnInit() { }


  loadUsers(infiniteScroll?) {
    this.licenciaService.getLicencias(this.size,this.page)
    .subscribe(res  =>{
                 console.log("resultados");
                 this.licencias=this.licencias.concat(res['content']);
                 if (infiniteScroll) {
                  infiniteScroll.target.complete();       
                  }             
              });
  }
 
  loadMore(infiniteScroll) {
    this.page++;
    this.loadUsers(infiniteScroll);
 
    if (this.page === this.maximumPages) {
      infiniteScroll.target.disabled = true;
    }
  }
  

  onChange(newValue) {
    console.log("onChange");
    console.log(this.url);

    this.router.navigateByUrl(this.url);
  
  
  }

}
