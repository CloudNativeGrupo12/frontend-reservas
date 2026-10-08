import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  BindingRequest,
  ExchangeRequest,
  ExchangeResponse,
  QueueRequest,
  QueueResponse,
} from '../models/admin.model';

@Injectable({ providedIn: 'root' })
export class AdminRabbitmqService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.api.adminRabbitmq}/api/admin`;

  crearCola(body: QueueRequest): Observable<QueueResponse> {
    return this.http.post<QueueResponse>(`${this.baseUrl}/queues`, body);
  }

  eliminarCola(name: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/queues/${encodeURIComponent(name)}`);
  }

  crearExchange(body: ExchangeRequest): Observable<ExchangeResponse> {
    return this.http.post<ExchangeResponse>(`${this.baseUrl}/exchanges`, body);
  }

  eliminarExchange(name: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/exchanges/${encodeURIComponent(name)}`);
  }

  crearBinding(body: BindingRequest): Observable<BindingRequest> {
    return this.http.post<BindingRequest>(`${this.baseUrl}/bindings`, body);
  }

  eliminarBinding(body: BindingRequest): Observable<void> {
    return this.http.request<void>('delete', `${this.baseUrl}/bindings`, { body });
  }
}
