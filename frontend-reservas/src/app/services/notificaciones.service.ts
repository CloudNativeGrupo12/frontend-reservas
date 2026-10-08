import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Notificacion } from '../models/notificacion.model';
import { datosEvento, RegistroProcesado } from '../models/registro-procesado.model';

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.api.notificaciones}/notificaciones`;

  listar(): Observable<Notificacion[]> {
    return this.http.get<RegistroProcesado[]>(this.baseUrl).pipe(map((rows) => rows.map((row) => ({
      notificacionId: row.EVENTO_ID,
      reservaId: row.RESERVA_ID,
      emailCliente: datosEvento(row.PAYLOAD).emailCliente,
      estado: row.RESULTADO,
      timestamp: row.PROCESADO_EN,
    }))));
  }
}
