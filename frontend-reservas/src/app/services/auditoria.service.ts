import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auditoria } from '../models/auditoria.model';
import { datosEvento, RegistroProcesado } from '../models/registro-procesado.model';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.api.auditoria}/auditoria`;

  listar(): Observable<Auditoria[]> {
    return this.http.get<RegistroProcesado[]>(this.baseUrl).pipe(map((rows) => rows.map((row) => {
      const event = datosEvento(row.PAYLOAD);
      return {
        eventoId: row.EVENTO_ID,
        reservaId: row.RESERVA_ID,
        tipo: event.tipoEvento,
        clienteId: event.clienteId,
        resultado: row.RESULTADO,
        timestamp: row.PROCESADO_EN,
      };
    })));
  }
}
