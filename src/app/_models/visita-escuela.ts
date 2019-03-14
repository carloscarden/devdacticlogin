import { Establecimiento } from "./establecimiento";
import { TipoVisita } from "./tipo-visita";


export class VisitaEscuela {
    id: number;
    fechaInicio: Date;
    fechaFin: Date;
    horaInicio: Date;
    horaFin: Date;
    escuela: Establecimiento;
    motivo: TipoVisita;
    observaciones: string;
    otroInspector: string;
    imagenes: Array<any>;

    
}


