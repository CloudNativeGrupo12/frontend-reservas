import { Component, inject, OnInit, signal } from '@angular/core';
import { AuditoriaService } from '../../services/auditoria.service';
import { Auditoria } from '../../models/auditoria.model';
import { Loading } from '../../shared/loading/loading';

@Component({
  selector: 'app-auditoria',
  imports: [Loading],
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.css',
})
export class AuditoriaComponent implements OnInit {
  private readonly auditoriaService = inject(AuditoriaService);

  protected readonly registros = signal<Auditoria[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.error.set('');
    this.auditoriaService.listar().subscribe({
      next: (registros) => this.registros.set(registros),
      error: (err) => this.error.set(err.message),
      complete: () => this.loading.set(false),
    });
  }
}
