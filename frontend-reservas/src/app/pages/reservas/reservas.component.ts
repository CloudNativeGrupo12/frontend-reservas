import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';
import { Reserva } from '../../models/reserva.model';
import { Loading } from '../../shared/loading/loading';

@Component({
  selector: 'app-reservas',
  imports: [ReactiveFormsModule, Loading],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css',
})
export class ReservasComponent implements OnInit {
  private readonly reservasService = inject(ReservasService);
  private readonly fb = inject(FormBuilder);

  protected readonly reservas = signal<Reserva[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly message = signal('');

  protected readonly form = this.fb.nonNullable.group({
    clienteId: ['', Validators.required],
    emailCliente: ['', [Validators.required, Validators.email]],
    fechaReserva: ['', Validators.required],
    horaInicio: ['', Validators.required],
    horaFin: ['', Validators.required],
    cantidadPersonas: [1, [Validators.required, Validators.min(1), Validators.max(8)]],
  });

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.loading.set(true);
    this.reservasService.listar().subscribe({
      next: (reservas) => this.reservas.set(reservas),
      error: (err) => { this.error.set(err.message); this.loading.set(false); },
      complete: () => this.loading.set(false),
    });
  }

  crear(): void {
    if (this.form.invalid) {
      return;
    }

    this.error.set('');
    this.message.set('');
    this.reservasService.crear(this.form.getRawValue()).subscribe({
      next: (reserva) => {
        this.message.set(`Reserva ${reserva.reservaId} creada correctamente.`);
        this.form.reset({ cantidadPersonas: 1 });
        this.cargarReservas();
      },
      error: (err) => this.error.set(err.message),
    });
  }

  publicar(id: string): void {
    this.error.set('');
    this.message.set('');
    this.reservasService.publicar(id).subscribe({
      next: () => {
        this.message.set(`Publicación de la reserva ${id} reintentada.`);
        this.cargarReservas();
      },
      error: (err) => this.error.set(err.message),
    });
  }
}
