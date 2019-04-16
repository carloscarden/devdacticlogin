import { Component, OnInit  } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';


// modal para agregar una nueva tarea
import { ModalController, AlertController  } from '@ionic/angular';
import { EventModalPage } from '../event-modal/event-modal.page'


// servicios
import { AgendaServiceService } from 'src/app/_services/agenda-service.service';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {
  

  restInfScroll;
  page = 0;
  maximumPages = 12;
  anio=  new Date().getFullYear();
  anioBuscado= new Date().getFullYear();
  nombreMeses= ["ENERO","FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
  mesesCargados=[];
  mesAbuscar="todos";
 
  constructor(
    protected agendaService: AgendaServiceService,
    private modalCtrl: ModalController,
    private router:Router) { 
   
     
    }

  ngOnInit() { 
    for(var _i =0; _i<2; _i++){
      this.nuevoMes(this.page+1);        
      this.page=this.page+1;

    }

   }


   nuevoMes(mes, infiniteScroll?){
    this.agendaService.getEvents(mes,this.anio)
        .subscribe(res  =>{
                    let mesActual=this.nombreMeses[mes-1];
                    if(res==null){
                      this.mesesCargados.push({nombreMes:mesActual, nroMes:mes, tareas:[]} )
                    }
                    else{
                      this.mesesCargados.push({nombreMes:mesActual, nroMes:mes, tareas:res} );
                    };
                    if (infiniteScroll) {
                      infiniteScroll.target.complete();       
                      } 
                    
        });
  }

  loadMore(infiniteScroll) {
    this.restInfScroll=infiniteScroll;
    if(this.page < this.maximumPages){
      
      this.nuevoMes(this.page+1,infiniteScroll);
      this.page++;
      console.log(this.page >= this.maximumPages);
      if (this.page >= this.maximumPages) {
        infiniteScroll.target.disabled = true;
      }
    }
    else{
      infiniteScroll.target.disabled = true;
    }
    
  }


  ordenar(){
    var x=this.mesesCargados.sort((a, b) => {
      const genreA = a.nroMes;
      const genreB = b.nroMes;
      
      let comparison = 0;
      if (genreA > genreB) {
        comparison = 1;
      } else if (genreA < genreB) {
        comparison = -1;
      }
      return comparison;
    });

  }


  filtrar(){
      this.mesesCargados=[];
      this.anioBuscado= this.anio;
      if(this.mesAbuscar=="todos"){
        if(this.restInfScroll!=null){
          this.restInfScroll.target.disabled=false;
        }
        
          this.maximumPages=12;
          this.page=0;
          for(var _i =0; _i<2; _i++){
            this.nuevoMes(this.page+1);        
            this.page=this.page+1;
      
          }
      }
      else{
        this.page=parseInt(this.mesAbuscar)+1;
        this.maximumPages=1;
        this.nuevoMes(this.page);

      }

   }

   stringAsDate(dateStr) {
    let reemplazar=dateStr.replace(/-/g,"/");
    return new Date(reemplazar);
  }

  changeMode(mode) {
    
  }





}
