import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Notificacion } from '../models/notificacion.model';
import { RegistroProcesado, datosEvento } from '../models/registro-procesado.model';
@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private readonly http = inject(HttpClient);
  listar(): Observable<Notificacion[]> {
    return this.http
      .get<RegistroProcesado[]>(`${environment.api.notificaciones}/notificaciones`)
      .pipe(
        map((rows) =>
          rows.map((r) => {
            const payload = datosEvento(r.PAYLOAD);
            return {
              notificacionId: r.EVENTO_ID,
              reservaId: r.RESERVA_ID,
              emailCliente: payload.emailCliente,
              estado: r.RESULTADO,
              timestamp: r.PROCESADO_EN,
            };
          }),
        ),
      );
  }
}
