import { TipoConvocatoria } from "./tipo-convocatoria";
import { Imagen } from "./imagen";
import { Distrito } from "./distrito";



export class Convocatoria {
    id:number;
    inicio:string;
    fin:string;
    tipoConvocatoria: TipoConvocatoria;
    distrito: Distrito;
    lugar: string;
    idInspector:number;
    adjuntos:Array<Imagen>;

}

