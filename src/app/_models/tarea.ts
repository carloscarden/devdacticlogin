import { Actividad } from "./actividad";

export class Tarea {
    id: number;
    inicio: Date;
    fin: Date;
    detalle: string;
    actividad: Actividad;
}
