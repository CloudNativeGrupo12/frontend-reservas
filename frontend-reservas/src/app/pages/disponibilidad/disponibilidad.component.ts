import { Component, inject, OnInit, signal } from '@angular/core';
import { DisponibilidadService } from '../../services/disponibilidad.service';
import { Mesa } from '../../models/mesa.model';
import { Asignacion } from '../../models/asignacion.model';
import { Loading } from '../../shared/loading/loading';

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
    this.disponibilidadService.getMesas().subscribe({
      next: (mesas) => this.mesas.set(mesas),
      error: (err) => this.error.set(err.message),
      complete: () => this.loading.set(false),
    });
    this.disponibilidadService.getAsignaciones().subscribe({
      next: (asignaciones) => this.asignaciones.set(asignaciones),
      error: (err) => this.error.set(err.message),
    });
  }
}
