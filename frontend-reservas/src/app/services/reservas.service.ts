import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reserva, ReservaSolicitud } from '../models/reserva.model';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.api.reservas}/reservas`;

  listar(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.baseUrl);
  }

  obtener(id: string): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.baseUrl}/${id}`);
  }

  crear(solicitud: ReservaSolicitud): Observable<Reserva> {
    return this.http.post<Reserva>(this.baseUrl, solicitud);
  }

  publicar(id: string): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.baseUrl}/${id}/publicar`, null);
  }
}
