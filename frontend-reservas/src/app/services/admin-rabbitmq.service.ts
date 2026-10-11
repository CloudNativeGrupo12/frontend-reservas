import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  BindingRequest,
  ExchangeRequest,
  QueueRequest,
  AdminResponse,
} from '../models/admin.model';
@Injectable({ providedIn: 'root' })
export class AdminRabbitmqService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.api.adminRabbitmq}/api/admin`;
  crearCola(body: QueueRequest): Observable<AdminResponse> {
    return this.http.post<AdminResponse>(`${this.url}/queues`, body);
  }
  eliminarCola(name: string): Observable<AdminResponse> {
    return this.http.delete<AdminResponse>(`${this.url}/queues/${encodeURIComponent(name)}`);
  }
  crearExchange(body: ExchangeRequest): Observable<AdminResponse> {
    return this.http.post<AdminResponse>(`${this.url}/exchanges`, body);
  }
  eliminarExchange(name: string): Observable<AdminResponse> {
    return this.http.delete<AdminResponse>(`${this.url}/exchanges/${encodeURIComponent(name)}`);
  }
  crearBinding(body: BindingRequest): Observable<AdminResponse> {
    return this.http.post<AdminResponse>(`${this.url}/bindings`, body);
  }
  eliminarBinding(body: BindingRequest): Observable<AdminResponse> {
    return this.http.request<AdminResponse>('delete', `${this.url}/bindings`, { body });
  }
}
