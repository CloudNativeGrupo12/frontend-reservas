import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Notificacion } from '../models/notificacion.model';

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.api.notificaciones}/notificaciones`;

  listar(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.baseUrl);
  }
}
