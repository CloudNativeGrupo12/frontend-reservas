import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { DisponibilidadService } from '../../services/disponibilidad.service';
import { Mesa } from '../../models/mesa.model';
import { Asignacion } from '../../models/asignacion.model';
import { Loading } from '../../shared/loading/loading';
import { Icon } from '../../shared/icon/icon';
import { errorMessage } from '../../shared/http-error';
import { localToday } from '../../shared/reservation-validation';
@Component({
  selector: 'app-disponibilidad',
  imports: [Loading, Icon, DatePipe, RouterLink],
  templateUrl: './disponibilidad.html',
  styleUrl: './disponibilidad.css',
})
export class DisponibilidadComponent implements OnInit {
  private readonly service = inject(DisponibilidadService);
  protected readonly mesas = signal<Mesa[]>([]);
  protected readonly asignaciones = signal<Asignacion[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly date = signal(localToday());
  protected readonly mesa = signal('');
  protected readonly filtered = computed(() =>
    this.asignaciones()
      .filter(
        (a) =>
          (!this.date() || a.fechaReserva === this.date()) &&
          (!this.mesa() || a.mesaId === this.mesa()),
      )
      .sort((a, b) => (a.horaInicio ?? '').localeCompare(b.horaInicio ?? '')),
  );
  ngOnInit(): void {
    this.cargar();
  }
  cargar(): void {
    this.loading.set(true);
    this.error.set('');
    forkJoin({ mesas: this.service.getMesas(), asignaciones: this.service.getAsignaciones() })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (r) => {
          this.mesas.set(r.mesas);
          this.asignaciones.set(r.asignaciones);
        },
        error: (e) => this.error.set(errorMessage(e)),
      });
  }
  asignacionesMesa(id: string): number {
    return this.asignaciones().filter(
      (a) => a.mesaId === id && (!this.date() || a.fechaReserva === this.date()),
    ).length;
  }
}
