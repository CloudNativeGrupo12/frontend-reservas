import { Component, inject, OnInit, signal } from '@angular/core';
import { DisponibilidadService } from '../../services/disponibilidad.service';
import { Mesa } from '../../models/mesa.model';
import { Asignacion } from '../../models/asignacion.model';
import { Loading } from '../../shared/loading/loading';
import { forkJoin, finalize } from 'rxjs';

@Component({
  selector: 'app-disponibilidad',
  imports: [Loading],
  templateUrl: './disponibilidad.html',
  styleUrl: './disponibilidad.css',
})
export class DisponibilidadComponent implements OnInit {
  private readonly disponibilidadService = inject(DisponibilidadService);

  protected readonly mesas = signal<Mesa[]>([]);
  protected readonly asignaciones = signal<Asignacion[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.error.set('');
    forkJoin({
      mesas: this.disponibilidadService.getMesas(),
      asignaciones: this.disponibilidadService.getAsignaciones(),
    }).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: ({ mesas, asignaciones }) => {
        this.mesas.set(mesas);
        this.asignaciones.set(asignaciones);
      },
      error: (err) => this.error.set(err.message),
    });
  }
}
