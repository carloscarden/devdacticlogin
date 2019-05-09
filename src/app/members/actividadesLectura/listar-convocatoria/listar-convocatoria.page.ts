import { Component, OnInit } from '@angular/core';

/*  SERVICES */
import { ConvocatoriaServiceService } from './../../../_services/convocatoria-service.service';
import { AuthenticationService } from './../../../_services/authentication.service';



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
  idInspector=1;
  convocatorias=[];
  size=5;
  opciones=["Convocatoria","Trabajo Administrativo","Visita Escuela","Licencia"];

  constructor(private convocatoriaService: ConvocatoriaServiceService,
              private authenticationService: AuthenticationService
            ) {
                this.url=""

                let currentUser = this.authenticationService.currentUserValue;
                this.idInspector= currentUser.id;
                this.convocatoriaService.getConvocatorias(this.size,this.page, this.idInspector)
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
      let currentUser = this.authenticationService.currentUserValue;
      this.idInspector= currentUser.id;
      this.convocatoriaService.getConvocatorias(this.size,page, this.idInspector)
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

    // el infinite scroll actua cuando hay por lo menos 2 convocatorias, por eso pido paginas hasta tener 2 
    // o hasta llegar al tope de las paginas
    while(this.convocatorias.length<2 && !(this.page === this.maximumPages+1)){
      this.loadConvocatorias(this.page, infiniteScroll );
      console.log(this.convocatorias);
      this.page++;
    }
      
  }



  // Conversiones para que se vea con un formato mejor
  stringAsDate(dateStr) {
    let reemplazar=dateStr.replace(/-/g,"/");
    return new Date(reemplazar);
  }


  hora(dateStr){
    var a=dateStr.split(" ")
    return a[1];
  }



 


}
