import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';
import { ReservasComponent } from './reservas.component';
import { ReservasService } from '../../services/reservas.service';
import { Reserva } from '../../models/reserva.model';
import { localToday } from '../../shared/reservation-validation';

describe('Estados de la agenda de reservas', () => {
  it('explica los campos de fecha y salida que faltan al enviar el formulario', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: ReservasService, useValue: { listar: () => of([]) } }],
    });
    const fixture = TestBed.createComponent(ReservasComponent);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    (page.querySelector('button.btn-primary') as HTMLButtonElement).click();
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as {
      form: { patchValue(value: unknown): void };
      crear(): void;
    };
    component.form.patchValue({ fechaReserva: '', horaFin: '' });
    component.crear();
    fixture.detectChanges();
    expect(page.textContent).toContain('Selecciona la fecha de visita.');
    expect(page.textContent).toContain('Selecciona la hora de salida.');
  });
  it('una actualización nueva cancela la consulta anterior y evita mostrar datos obsoletos', () => {
    const oldResult = new Subject<Reserva[]>();
    const newResult = new Subject<Reserva[]>();
    let request = 0;
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ReservasService,
          useValue: { listar: () => (request++ === 0 ? oldResult : newResult) },
        },
      ],
    });
    const fixture = TestBed.createComponent(ReservasComponent);
    fixture.detectChanges();
    fixture.componentInstance.cargarReservas();
    const row = {
      reservaId: 'res-1',
      eventoId: 'evt-1',
      clienteId: 'cli-1',
      emailCliente: 'nuevo@example.com',
      mesaId: 'mesa-01',
      fechaReserva: localToday(),
      horaInicio: '18:00',
      horaFin: '20:00',
      cantidadPersonas: 2,
      estado: 'CONFIRMADA',
      publicacion: 'PUBLICADA',
    };
    newResult.next([row]);
    newResult.complete();
    oldResult.next([{ ...row, emailCliente: 'viejo@example.com' }]);
    oldResult.complete();
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.textContent).toContain('nuevo@example.com');
    expect(page.textContent).not.toContain('viejo@example.com');
    expect(page.querySelector('app-loading')).toBeNull();
  });
  it('termina la carga y permite reintentar cuando falla el servicio', () => {
    const service = { listar: () => throwError(() => new HttpErrorResponse({ status: 503 })) };
    TestBed.configureTestingModule({
      providers: [{ provide: ReservasService, useValue: service }],
    });
    const fixture = TestBed.createComponent(ReservasComponent);
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('app-loading')).toBeNull();
    expect(page.querySelector('[role="alert"]')?.textContent).toContain('Volver a intentar');
  });
  it('bloquea solicitudes repetidas mientras se confirma una reserva', () => {
    const result = new Subject<Reserva>();
    let calls = 0;
    const service = {
      listar: () => of([]),
      crear: () => {
        calls++;
        return result;
      },
    };
    TestBed.configureTestingModule({
      providers: [{ provide: ReservasService, useValue: service }],
    });
    const component = TestBed.createComponent(ReservasComponent).componentInstance;
    const publicComponent = component as unknown as {
      form: { setValue(value: unknown): void };
      crear(): void;
    };
    publicComponent.form.setValue({
      clienteId: 'cli-1',
      emailCliente: 'cliente@example.com',
      fechaReserva: localToday(),
      horaInicio: '18:00',
      horaFin: '20:00',
      cantidadPersonas: 2,
    });
    publicComponent.crear();
    publicComponent.crear();
    expect(calls).toBe(1);
    result.complete();
  });
});
