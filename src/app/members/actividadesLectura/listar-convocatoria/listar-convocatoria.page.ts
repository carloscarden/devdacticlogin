import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

/*  SERVICES */
import { ActividadesService } from './../../../_services/actividades.service';
import { Todo, TodoService } from './../../../_services/todo.service';


/*  MODELOS */
/*import { Convocatoria } from './../../../_models/convocatoria';
import { TipoConvocatoria } from './../../../_models/tipo-convocatoria';
import { Imagen } from './../../../_models/imagen';*/


@Component({
  selector: 'app-listar-convocatoria',
  templateUrl: './listar-convocatoria.page.html',
  styleUrls: ['./listar-convocatoria.page.scss'],
})
export class ListarConvocatoriaPage implements OnInit {
  url;
  tipo;
  filtroTipo=false;
  page = 0;
  maximumPages = 3;
  convocatorias=[];
  size=5;
  opciones=["Convocatoria","Trabajo Administrativo","Visita Escuela","Licencia"];

  constructor(private convocatoriaService: ActividadesService,
              private router:Router,
            ) {
                this.url=""

                this.convocatoriaService.getConvocatorias(this.size,this.page)
                .subscribe(res  =>{
                             this.convocatorias=res.content;
                             this.maximumPages=res.totalPages-1;
                            }  
                           );

  }

  ngOnInit() {
    this.url=""
  }



  loadConvocatorias(page, infiniteScroll? ) {
    if(page <= this.maximumPages){
      this.convocatoriaService.getConvocatorias(this.size,page)
      .subscribe(res  =>{
                   console.log("page"); console.log(this.page);
                   this.convocatorias=this.convocatorias.concat(res['content']);
                   console.log(this.convocatorias);
                   if(this.filtroTipo){
                     if(!(this.tipo === "")){
                        console.log("entro");
                        this.convocatorias = this.convocatorias.filter(items => items.tipoConvocatoria.descripcion.toLowerCase() === this.tipo.toLowerCase());
                        console.log(this.convocatorias);
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
    this.loadConvocatorias(this.page,infiniteScroll);
    if (this.page >= this.maximumPages ) {
      infiniteScroll.target.disabled = true;
    }
  }


  filtrar(infiniteScroll?){
    this.filtroTipo=true;
    this.convocatorias = [];
    this.page=0;
    while(this.convocatorias.length<2 && !(this.page === this.maximumPages+1)){
      this.loadConvocatorias(this.page, infiniteScroll );
      console.log(this.convocatorias);
      this.page++;
    }
      
  }


 


}
