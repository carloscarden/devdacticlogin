import { TipoConvocatoria } from "./tipo-convocatoria";
import { Imagen } from "./imagen";


export class Convocatoria {
    id:number;
    inicio:string;
    fin:string;
    tipoConvocatoria: TipoConvocatoria;
    adjuntos:Array<Imagen>;

}

