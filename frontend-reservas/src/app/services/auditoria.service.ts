import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auditoria } from '../models/auditoria.model';
import { RegistroProcesado, datosEvento } from '../models/registro-procesado.model';
@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private readonly http = inject(HttpClient);
  listar(): Observable<Auditoria[]> {
    return this.http.get<RegistroProcesado[]>(`${environment.api.auditoria}/auditoria`).pipe(
      map((rows) =>
        rows.map((r) => {
          const payload = datosEvento(r.PAYLOAD);
          return {
            eventoId: r.EVENTO_ID,
            reservaId: r.RESERVA_ID,
            tipo: payload.tipoEvento,
            resultado: r.RESULTADO,
            clienteId: payload.clienteId,
            timestamp: r.PROCESADO_EN,
          };
        }),
      ),
    );
  }
}
