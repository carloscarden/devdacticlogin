import { TipoConvocatoria } from "./tipo-convocatoria";


export class Convocatoria {
    id:number;
    inicio:Date;
    fin:Date;
    tipoConvocatoria: TipoConvocatoria;
    imagenes:Array<any>;

}

