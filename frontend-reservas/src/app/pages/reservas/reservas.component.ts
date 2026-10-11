import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { ReservasService } from '../../services/reservas.service';
import { Reserva } from '../../models/reserva.model';
import { Loading } from '../../shared/loading/loading';
import { Icon } from '../../shared/icon/icon';
import { errorMessage } from '../../shared/http-error';
import { localToday, requiredText, reservationSchedule } from '../../shared/reservation-validation';
@Component({
  selector: 'app-reservas',
  imports: [ReactiveFormsModule, Loading, Icon, DatePipe],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css',
})
export class ReservasComponent implements OnInit {
  private readonly service = inject(ReservasService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private listRequest?: Subscription;
  protected readonly reservas = signal<Reserva[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly publishing = signal('');
  protected readonly listError = signal('');
  protected readonly error = signal('');
  protected readonly message = signal('');
  protected readonly warning = signal('');
  protected readonly formVisible = signal(false);
  protected readonly search = signal('');
  protected readonly date = signal('');
  protected readonly publication = signal('');
  protected readonly today = localToday();
  protected readonly filtered = computed(() => {
    const search = this.search().toLocaleLowerCase().trim();
    return this.reservas()
      .filter(
        (r) =>
          (!search ||
            [r.reservaId, r.clienteId, r.emailCliente, r.mesaId].some((x) =>
              x?.toLocaleLowerCase().includes(search),
            )) &&
          (!this.date() || r.fechaReserva === this.date()) &&
          (!this.publication() || r.publicacion === this.publication()),
      )
      .sort((a, b) =>
        `${b.fechaReserva} ${b.horaInicio}`.localeCompare(`${a.fechaReserva} ${a.horaInicio}`),
      );
  });
  protected readonly form = this.fb.nonNullable.group(
    {
      clienteId: ['', requiredText],
      emailCliente: ['', [requiredText, Validators.email]],
      fechaReserva: [this.today, Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      cantidadPersonas: [
        2,
        [Validators.required, Validators.min(1), Validators.max(8), Validators.pattern(/^\d+$/)],
      ],
    },
    { validators: reservationSchedule },
  );
  ngOnInit(): void {
    this.cargarReservas();
  }
  cargarReservas(): void {
    this.listRequest?.unsubscribe();
    this.loading.set(true);
    this.listError.set('');
    this.listRequest = this.service
      .listar()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (r) => this.reservas.set(r),
        error: (e) => this.listError.set(errorMessage(e)),
      });
  }
  crear(): void {
    if (this.saving()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.error.set('');
    this.message.set('');
    this.warning.set('');
    this.saving.set(true);
    const value = this.form.getRawValue();
    value.clienteId = value.clienteId.trim();
    value.emailCliente = value.emailCliente.trim();
    this.service
      .crear(value)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (r) => {
          this.message.set(
            `Reserva confirmada para ${r.cantidadPersonas} personas. Mesa ${r.mesaId.replace('mesa-', '')}, ${r.fechaReserva} de ${r.horaInicio.slice(0, 5)} a ${r.horaFin.slice(0, 5)}.`,
          );
          if (r.publicacion === 'PENDIENTE')
            this.warning.set(
              'La mesa está reservada, pero la confirmación por correo está pendiente. Puedes reintentar su envío desde la lista.',
            );
          this.form.reset({ fechaReserva: this.today, cantidadPersonas: 2 });
          this.formVisible.set(false);
          this.cargarReservas();
        },
        error: (e) => this.error.set(errorMessage(e)),
      });
  }
  publicar(id: string): void {
    if (this.publishing()) return;
    this.publishing.set(id);
    this.error.set('');
    this.message.set('');
    this.warning.set('');
    this.service
      .publicar(id)
      .pipe(finalize(() => this.publishing.set('')))
      .subscribe({
        next: (r) => {
          if (r.publicacion === 'PUBLICADA')
            this.message.set('El evento de confirmación fue enviado al sistema de notificaciones.');
          else this.warning.set('El envío sigue pendiente. Inténtalo nuevamente más tarde.');
          this.cargarReservas();
        },
        error: (e) => this.error.set(errorMessage(e)),
      });
  }
  resetFilters(): void {
    this.search.set('');
    this.date.set('');
    this.publication.set('');
  }
  invalid(name: string): boolean {
    const control = this.form.get(name);
    return !!(control?.touched && control.invalid);
  }
}
