import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Mesa } from '../models/mesa.model';
import { Asignacion } from '../models/asignacion.model';

interface AsignacionApi {
  ASIGNACION_ID: string; RESERVA_ID: string; MESA_ID: string;
  FECHA: string; HORA_INICIO: string; HORA_FIN: string;
}

@Injectable({ providedIn: 'root' })
export class DisponibilidadService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.api.disponibilidad;

  getMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.baseUrl}/mesas`);
  }

  getAsignaciones(): Observable<Asignacion[]> {
    return this.http.get<AsignacionApi[]>(`${this.baseUrl}/asignaciones`).pipe(map((rows) => rows.map((row) => ({
      asignacionId: row.ASIGNACION_ID, reservaId: row.RESERVA_ID, mesaId: row.MESA_ID,
      fechaReserva: row.FECHA, horaInicio: row.HORA_INICIO, horaFin: row.HORA_FIN,
    }))));
  }
}
