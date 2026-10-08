import { Component, inject, OnInit, signal } from '@angular/core';
import { NotificacionesService } from '../../services/notificaciones.service';
import { Notificacion } from '../../models/notificacion.model';
import { Loading } from '../../shared/loading/loading';

@Component({
  selector: 'app-notificaciones',
  imports: [Loading],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css',
})
export class NotificacionesComponent implements OnInit {
  private readonly notificacionesService = inject(NotificacionesService);

  protected readonly notificaciones = signal<Notificacion[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.error.set('');
    this.notificacionesService.listar().subscribe({
      next: (notificaciones) => this.notificaciones.set(notificaciones),
      error: (err) => this.error.set(err.message),
      complete: () => this.loading.set(false),
    });
  }
}
