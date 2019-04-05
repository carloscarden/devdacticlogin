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
  tipo;
  filtroTipo=false;
  pagLicencia: Pagina;
  page = 0;
  maximumPages = 3;
  licencias=[];
  size=5;
  opciones=["Convocatoria","Trabajo Administrativo","Visita Escuela","Licencia"];
  value=0;

  constructor( private router:Router,
    private todoService: TodoService,
    private licenciaService:ActividadesService,
    private httpClient: HttpClient ) { 
      console.log("creacion del licencias");
      console.log(this.url);
      this.url="";
      this.licenciaService.getLicencias(this.size,this.page)
      .subscribe(res  =>{
                   console.log("resultados");
                   this.licencias=res.content;
                   this.maximumPages=res.totalPages-1;
                   console.log(res);
                  }  
                 );
    }

    


  ngOnInit() { 
    console.log("init del listar licencia");
    this.url="";
  }


  loadLicencias(page, infiniteScroll? ) {
    if(page <= this.maximumPages){
      this.licenciaService.getLicencias(this.size,page)
      .subscribe(res  =>{
                   console.log("page"); console.log(this.page);
                   this.licencias=this.licencias.concat(res['content']);
                   console.log(this.licencias);
                   if(this.filtroTipo){
                     if(!(this.tipo === "")){
                        console.log("entro");
                        this.licencias = this.licencias.filter(items => items.articulo.toLowerCase() === this.tipo.toLowerCase());
                        console.log(this.licencias);
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
    this.loadLicencias(this.page,infiniteScroll);
 
    if (this.page >= this.maximumPages) {
      infiniteScroll.target.disabled = true;
    }
  }

  filtrar(infiniteScroll?){
    console.log("filtrar");
    this.filtroTipo=true;
    this.licencias = [];
    this.page=0;
    while(this.licencias.length<2 && !(this.page === this.maximumPages+1)){
      this.loadLicencias(this.page, infiniteScroll );
      console.log(this.licencias);
      this.page++;
    }
      
  }

  checkFocus(newValue){
    console.log("Entra al focus");
    console.log("value");
    console.log(this.value);
    console.log("La url");
    console.log(this.url);
    this.value=this.value+1;
    console.log(this.value % 2==0);
   /* if(this.value % 2==0){
      this.router.navigateByUrl(this.url);
    }*/
    console.log(newValue)
  }
  

  onChange(newValue) {
    console.log("onChange");
    console.log("change de licencias");
    console.log(this.url);
    this.router.navigateByUrl(this.url);
  
  }

}
