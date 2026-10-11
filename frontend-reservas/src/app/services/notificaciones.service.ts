import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Notificacion } from '../models/notificacion.model';
import { BackendRecord, eventPayload, text } from '../shared/backend-record';
@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private readonly http = inject(HttpClient);
  listar(): Observable<Notificacion[]> {
    return this.http.get<BackendRecord[]>(`${environment.api.notificaciones}/notificaciones`).pipe(
      map((rows) =>
        rows.map((r) => {
          const payload = eventPayload(r);
          return {
            notificacionId: r.EVENTO_ID,
            reservaId: r.RESERVA_ID,
            emailCliente: text(payload, 'emailCliente'),
            asunto: 'Confirmación de reserva',
            estado: r.RESULTADO,
            timestamp: r.PROCESADO_EN,
          };
        }),
      ),
    );
  }
}
