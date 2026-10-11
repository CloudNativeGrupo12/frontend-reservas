import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { AuditoriaService } from '../../services/auditoria.service';
import { Auditoria } from '../../models/auditoria.model';
import { Loading } from '../../shared/loading/loading';
import { Icon } from '../../shared/icon/icon';
import { errorMessage } from '../../shared/http-error';
@Component({
  selector: 'app-auditoria',
  imports: [Loading, Icon, DatePipe],
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.css',
})
export class AuditoriaComponent implements OnInit {
  private readonly service = inject(AuditoriaService);
  protected readonly registros = signal<Auditoria[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly search = signal('');
  protected readonly filtered = computed(() => {
    const search = this.search().trim().toLowerCase();
    return this.registros().filter(
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
        next: (r) => this.registros.set(r),
        error: (e) => this.error.set(errorMessage(e)),
      });
  }
}
