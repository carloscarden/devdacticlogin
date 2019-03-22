import { TipoTrabajoAdministrativo } from "./tipo-trabajo-administrativo";
import { Imagen } from "./imagen";

export class TrabajoAdministrativo {
    inicio:string;
    fin:string;
    observaciones: string;
    lugar:string;
    tipoTrabajoAdmin: TipoTrabajoAdministrativo;
    adjuntos:Array<Imagen>;
    idInspector:number;

}
