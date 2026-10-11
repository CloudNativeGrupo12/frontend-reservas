import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Mesa } from '../models/mesa.model';
import { Asignacion } from '../models/asignacion.model';
interface AsignacionRecord {
  ASIGNACION_ID: string;
  RESERVA_ID: string;
  MESA_ID: string;
  FECHA: string;
  HORA_INICIO: string;
  HORA_FIN: string;
}
@Injectable({ providedIn: 'root' })
export class DisponibilidadService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.api.disponibilidad;
  getMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.url}/mesas`);
  }
  getAsignaciones(): Observable<Asignacion[]> {
    return this.http
      .get<AsignacionRecord[]>(`${this.url}/asignaciones`)
      .pipe(
        map((rows) =>
          rows.map((r) => ({
            asignacionId: r.ASIGNACION_ID,
            reservaId: r.RESERVA_ID,
            mesaId: r.MESA_ID,
            fechaReserva: r.FECHA,
            horaInicio: r.HORA_INICIO,
            horaFin: r.HORA_FIN,
          })),
        ),
      );
  }
}
