import { TipoConvocatoria } from "./tipo-convocatoria";
import { Imagen } from "./imagen";


export class Convocatoria {
    id:number;
    inicio:Date;
    fin:Date;
    tipoConvocatoria: TipoConvocatoria;
    adjuntos:Array<Imagen>;

}

