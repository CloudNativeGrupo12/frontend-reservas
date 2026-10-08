import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminRabbitmqService } from '../../services/admin-rabbitmq.service';

@Component({
  selector: 'app-admin-rabbitmq',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-rabbitmq.html',
  styleUrl: './admin-rabbitmq.css',
})
export class AdminRabbitmqComponent {
  private readonly adminService = inject(AdminRabbitmqService);
  private readonly fb = inject(FormBuilder);

  protected readonly error = signal('');
  protected readonly message = signal('');

  protected readonly queueForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    durable: [true],
  });

  protected readonly exchangeForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    type: ['direct' as 'direct' | 'fanout' | 'topic', Validators.required],
    durable: [true],
  });

  protected readonly bindingForm = this.fb.nonNullable.group({
    queue: ['', Validators.required],
    exchange: ['', Validators.required],
    routingKey: ['', Validators.required],
  });

  private notify(message: string): void {
    this.message.set(message);
    this.error.set('');
  }

  crearCola(): void {
    if (this.queueForm.invalid) {
      return;
    }
    this.adminService.crearCola(this.queueForm.getRawValue()).subscribe({
      next: (cola) => this.notify(`Cola "${cola.name}" creada.`),
      error: (err) => this.error.set(err.message),
    });
  }

  eliminarCola(name: string): void {
    this.adminService.eliminarCola(name).subscribe({
      next: () => this.notify(`Cola "${name}" eliminada.`),
      error: (err) => this.error.set(err.message),
    });
  }

  crearExchange(): void {
    if (this.exchangeForm.invalid) {
      return;
    }
    this.adminService.crearExchange(this.exchangeForm.getRawValue()).subscribe({
      next: (exchange) => this.notify(`Exchange "${exchange.name}" creado.`),
      error: (err) => this.error.set(err.message),
    });
  }

  eliminarExchange(name: string): void {
    this.adminService.eliminarExchange(name).subscribe({
      next: () => this.notify(`Exchange "${name}" eliminado.`),
      error: (err) => this.error.set(err.message),
    });
  }

  crearBinding(): void {
    if (this.bindingForm.invalid) {
      return;
    }
    this.adminService.crearBinding(this.bindingForm.getRawValue()).subscribe({
      next: (binding) =>
        this.notify(
          `Binding ${binding.queue} -> ${binding.exchange} con routing key "${binding.routingKey}" creado.`,
        ),
      error: (err) => this.error.set(err.message),
    });
  }

  eliminarBinding(): void {
    if (this.bindingForm.invalid) {
      return;
    }
    this.adminService.eliminarBinding(this.bindingForm.getRawValue()).subscribe({
      next: () => this.notify('Binding eliminado.'),
      error: (err) => this.error.set(err.message),
    });
  }
}
