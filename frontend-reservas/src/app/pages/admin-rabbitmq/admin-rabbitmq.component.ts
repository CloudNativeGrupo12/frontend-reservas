import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, finalize } from 'rxjs';
import { AdminRabbitmqService } from '../../services/admin-rabbitmq.service';
import { BindingRequest } from '../../models/admin.model';
import { Icon } from '../../shared/icon/icon';
import { errorMessage } from '../../shared/http-error';
import { requiredText } from '../../shared/reservation-validation';
interface DeleteRequest {
  type: 'queue' | 'exchange' | 'binding';
  name: string;
  binding?: BindingRequest;
}
@Component({
  selector: 'app-admin-rabbitmq',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './admin-rabbitmq.html',
  styleUrl: './admin-rabbitmq.css',
})
export class AdminRabbitmqComponent {
  private readonly nameValidators = [
    requiredText,
    Validators.pattern(/^(?!amq\.)[A-Za-z0-9][A-Za-z0-9._-]{0,254}$/),
  ];
  private readonly service = inject(AdminRabbitmqService);
  private readonly fb = inject(FormBuilder);
  protected readonly tab = signal<'queues' | 'exchanges' | 'bindings'>('queues');
  protected readonly error = signal('');
  protected readonly message = signal('');
  protected readonly busy = signal(false);
  protected readonly pendingDelete = signal<DeleteRequest | null>(null);
  protected readonly queueForm = this.fb.nonNullable.group({
    name: ['', this.nameValidators],
    durable: [true],
  });
  protected readonly exchangeForm = this.fb.nonNullable.group({
    name: ['', this.nameValidators],
    type: ['direct' as 'direct' | 'fanout' | 'topic', Validators.required],
    durable: [true],
  });
  protected readonly bindingForm = this.fb.nonNullable.group({
    queue: ['', this.nameValidators],
    exchange: ['', this.nameValidators],
    routingKey: ['', Validators.maxLength(255)],
  });
  private operate<T>(request: Observable<T>, success: string): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.message.set('');
    request.pipe(finalize(() => this.busy.set(false))).subscribe({
      next: () => {
        this.message.set(success);
        this.pendingDelete.set(null);
      },
      error: (e) => this.error.set(errorMessage(e)),
    });
  }
  crearCola(): void {
    this.queueForm.markAllAsTouched();
    if (this.queueForm.invalid) return;
    const data = this.queueForm.getRawValue();
    data.name = data.name.trim();
    this.operate(this.service.crearCola(data), `Cola "${data.name}" creada correctamente.`);
  }
  crearExchange(): void {
    this.exchangeForm.markAllAsTouched();
    if (this.exchangeForm.invalid) return;
    const data = this.exchangeForm.getRawValue();
    data.name = data.name.trim();
    this.operate(this.service.crearExchange(data), `Exchange "${data.name}" creado correctamente.`);
  }
  private binding(): BindingRequest {
    const b = this.bindingForm.getRawValue();
    return { queue: b.queue.trim(), exchange: b.exchange.trim(), routingKey: b.routingKey.trim() };
  }
  crearBinding(): void {
    this.bindingForm.markAllAsTouched();
    if (this.bindingForm.invalid) return;
    const b = this.binding();
    this.operate(
      this.service.crearBinding(b),
      `Binding creado entre "${b.exchange}" y "${b.queue}".`,
    );
  }
  eliminarCola(name: string): void {
    if (/^(?!amq\.)[A-Za-z0-9][A-Za-z0-9._-]{0,254}$/.test(name.trim()) && !this.busy())
      this.pendingDelete.set({ type: 'queue', name: name.trim() });
  }
  eliminarExchange(name: string): void {
    if (/^(?!amq\.)[A-Za-z0-9][A-Za-z0-9._-]{0,254}$/.test(name.trim()) && !this.busy())
      this.pendingDelete.set({ type: 'exchange', name: name.trim() });
  }
  eliminarBinding(): void {
    if (this.bindingForm.invalid || this.busy()) return;
    const b = this.binding();
    this.pendingDelete.set({ type: 'binding', name: `${b.exchange} → ${b.queue}`, binding: b });
  }
  confirmarEliminacion(): void {
    const r = this.pendingDelete();
    if (!r || this.busy()) return;
    if (r.type === 'queue')
      this.operate(this.service.eliminarCola(r.name), `Cola "${r.name}" eliminada.`);
    else if (r.type === 'exchange')
      this.operate(this.service.eliminarExchange(r.name), `Exchange "${r.name}" eliminado.`);
    else if (r.binding)
      this.operate(this.service.eliminarBinding(r.binding), 'Binding eliminado correctamente.');
  }
  selectTab(tab: 'queues' | 'exchanges' | 'bindings'): void {
    this.tab.set(tab);
    this.pendingDelete.set(null);
    this.error.set('');
    this.message.set('');
  }
}
