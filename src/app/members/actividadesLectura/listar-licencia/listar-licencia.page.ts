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
      this.url="";
      this.licenciaService.getLicencias(this.size,this.page)
      .subscribe(res  =>{
                   console.log(res);
                   this.licencias=res.content;
                   this.maximumPages=res.totalPages-1;
                  }  
                 );
    }

    


  ngOnInit() { 
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



  onChange(newValue) {
    console.log("onChange_Convocatoria");
    let irUrl=""
    switch(this.url){
      case("Convocatoria"):{
          irUrl="/members/menu/actividadesLectura/listarConvocatoria/"+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5); 
          this.router.navigateByUrl(irUrl);
          break; 
      }
      case("Licencia"):{
          irUrl="/members/menu/actividadesLectura/listarLicencia/"+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5); 
          this.router.navigateByUrl(irUrl);
          break; 
      }
      case("Trabajo Administrativo"):{
         irUrl="/members/menu/actividadesLectura/listarTrabajoAdmin/"+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5); 
         this.router.navigateByUrl(irUrl);
         break; 
      }
      case("Visita Escuela"):{
         irUrl="/members/menu/actividadesLectura/listarVisita/"+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5); 
         this.router.navigateByUrl(irUrl);
         break; 
      }
      default:
         irUrl="/members/menu/actividadesLectura/listarConvocatoria/"+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
         this.router.navigateByUrl(irUrl);
         break; 
    };
  }

}
