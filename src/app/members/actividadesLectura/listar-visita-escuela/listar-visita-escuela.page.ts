import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';


/* SERVICES  */
import { ActividadesService } from './../../../_services/actividades.service';

/* MODELS  */
import { Establecimiento } from './../../../_models/establecimiento';
import { VisitaEscuela } from './../../../_models/visita-escuela';
import { MotivoVisita } from './../../../_models/motivo-visita';

@Component({
  selector: 'app-listar-visita-escuela',
  templateUrl: './listar-visita-escuela.page.html',
  styleUrls: ['./listar-visita-escuela.page.scss'],
})
export class ListarVisitaEscuelaPage implements OnInit {
  url;
  tipo;
  filtroTipo=false;
  page = 0;
  maximumPages = 3;
  visitasEscuelas=[];
  size=5;
  opciones=["Convocatoria","Trabajo Administrativo","Visita Escuela","Licencia"];



  constructor(private router:Router, private visitaService: ActividadesService) {
      this.visitaService.getVisitas(this.size,this.page)
      .subscribe(res  =>{
                  console.log("resultados");
                  this.visitasEscuelas=res.content;
                  this.maximumPages=res.totalPages-1;
                  console.log(res);
                  }  
      );
   }

  ngOnInit() {
  }


  loadVisitas(page, infiniteScroll? ) {
    if(page <= this.maximumPages){
      this.visitaService.getVisitas(this.size,page)
      .subscribe(res  =>{
                   console.log("page"); console.log(this.page);
                   this.visitasEscuelas=this.visitasEscuelas.concat(res['content']);
                   console.log(this.visitasEscuelas);
                   if(this.filtroTipo){
                     if(!(this.tipo === "")){
                        console.log("entro");
                        this.visitasEscuelas = this.visitasEscuelas.filter(items => items.establecimiento.nombre === this.tipo);
                        console.log(this.visitasEscuelas);
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
    this.loadVisitas(this.page,infiniteScroll);
    if (this.page >= this.maximumPages ) {
      infiniteScroll.target.disabled = true;
    }
  }


  filtrar(infiniteScroll?){
    console.log("filtrar");
    this.filtroTipo=true;
    this.visitasEscuelas = [];
    this.page=0;
    while(this.visitasEscuelas.length<2 && !(this.page === this.maximumPages+1)){
      this.loadVisitas(this.page, infiniteScroll );
      console.log(this.visitasEscuelas);
      this.page++;
    }
      
  }

  onChange(newValue) {
    console.log("onChange");
    console.log(this.url);

    switch(this.url){
      case("Convocatoria"):{
          this.router.navigateByUrl("/members/menu/actividadesLectura/listarConvocatoria");
          break; 
      }
      case("Licencia"):{
          this.router.navigateByUrl("/members/menu/actividadesLectura/listarLicencia");
          break; 
      }
      case("Trabajo Administrativo"):{
            this.router.navigateByUrl("/members/menu/actividadesLectura/listarTrabajoAdmin");
            break; 
      }
      case("Visita Escuela"):{
            this.router.navigateByUrl("/members/menu/actividadesLectura/listarVisita");
            break; 
      }
      default:
         this.router.navigateByUrl("/members/menu/actividadesLectura/listarConvocatoria");
         break; 
    };
  

  
  
  }

}
