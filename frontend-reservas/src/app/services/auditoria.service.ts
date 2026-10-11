import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auditoria } from '../models/auditoria.model';
import { BackendRecord, eventPayload, text } from '../shared/backend-record';
@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private readonly http = inject(HttpClient);
  listar(): Observable<Auditoria[]> {
    return this.http.get<BackendRecord[]>(`${environment.api.auditoria}/auditoria`).pipe(
      map((rows) =>
        rows.map((r) => {
          const payload = eventPayload(r);
          return {
            auditoriaId: r.EVENTO_ID,
            eventoId: r.EVENTO_ID,
            reservaId: r.RESERVA_ID,
            tipo: text(payload, 'tipoEvento') ?? r.RESULTADO,
            descripcion: r.RESULTADO,
            usuario: text(payload, 'clienteId'),
            timestamp: r.PROCESADO_EN,
          };
        }),
      ),
    );
  }
}
