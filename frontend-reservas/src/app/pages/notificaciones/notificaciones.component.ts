import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { NotificacionesService } from '../../services/notificaciones.service';
import { Notificacion } from '../../models/notificacion.model';
import { Loading } from '../../shared/loading/loading';
import { Icon } from '../../shared/icon/icon';
import { errorMessage } from '../../shared/http-error';
@Component({
  selector: 'app-notificaciones',
  imports: [Loading, Icon, DatePipe],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css',
})
export class NotificacionesComponent implements OnInit {
  private readonly service = inject(NotificacionesService);
  protected readonly notificaciones = signal<Notificacion[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly search = signal('');
  protected readonly filtered = computed(() => {
    const search = this.search().trim().toLowerCase();
    return this.notificaciones().filter(
      (r) =>
        !search ||
        Object.values(r).some((v) => typeof v === 'string' && v.toLowerCase().includes(search)),
    );
  });
  ngOnInit(): void {
    this.cargar();
  }
  cargar(): void {
    this.loading.set(true);
    this.error.set('');
    this.service
      .listar()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (r) => this.notificaciones.set(r),
        error: (e) => this.error.set(errorMessage(e)),
      });
  }
}
