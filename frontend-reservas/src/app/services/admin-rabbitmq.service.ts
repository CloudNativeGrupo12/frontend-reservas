import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  BindingRequest,
  ExchangeRequest,
  QueueRequest,
  QueueResponse,
  ExchangeResponse,
} from '../models/admin.model';
@Injectable({ providedIn: 'root' })
export class AdminRabbitmqService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.api.adminRabbitmq}/api/admin`;
  crearCola(body: QueueRequest): Observable<QueueResponse> {
    return this.http.post<QueueResponse>(`${this.url}/queues`, body);
  }
  eliminarCola(name: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/queues/${encodeURIComponent(name)}`);
  }
  crearExchange(body: ExchangeRequest): Observable<ExchangeResponse> {
    return this.http.post<ExchangeResponse>(`${this.url}/exchanges`, body);
  }
  eliminarExchange(name: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/exchanges/${encodeURIComponent(name)}`);
  }
  crearBinding(body: BindingRequest): Observable<BindingRequest> {
    return this.http.post<BindingRequest>(`${this.url}/bindings`, body);
  }
  eliminarBinding(body: BindingRequest): Observable<void> {
    return this.http.request<void>('delete', `${this.url}/bindings`, { body });
  }
}
