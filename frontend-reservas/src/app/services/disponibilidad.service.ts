import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Mesa } from '../models/mesa.model';
import { Asignacion } from '../models/asignacion.model';

@Injectable({ providedIn: 'root' })
export class DisponibilidadService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.api.disponibilidad;

  getMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.baseUrl}/mesas`);
  }

  getAsignaciones(): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${this.baseUrl}/asignaciones`);
  }
}
