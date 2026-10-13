import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NotificacionesService } from './notificaciones.service';
import { AuditoriaService } from './auditoria.service';
import { DisponibilidadService } from './disponibilidad.service';
import { environment } from '../../environments/environment';

describe('Contratos reales del backend', () => {
  let http: HttpTestingController;
  const record = {
    EVENTO_ID: 'evt-1',
    RESERVA_ID: 'res-1',
    RESULTADO: 'CORREO_ENVIADO',
    PROCESADO_EN: '2026-10-11T20:00:00Z',
    PAYLOAD: JSON.stringify({
      emailCliente: 'cliente@example.com',
      clienteId: 'cli-1',
      tipoEvento: 'ReservaConfirmada',
    }),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('muestra destinatario y estado a partir del registro de notificaciones', () => {
    TestBed.inject(NotificacionesService)
      .listar()
      .subscribe((rows) => {
        expect(rows[0].emailCliente).toBe('cliente@example.com');
        expect(rows[0].reservaId).toBe('res-1');
        expect(rows[0].estado).toBe('CORREO_ENVIADO');
      });
    http.expectOne(`${environment.api.notificaciones}/notificaciones`).flush([record]);
  });
  it('informa cuando el registro no contiene un evento válido', () => {
    let error: Error | undefined;
    TestBed.inject(NotificacionesService)
      .listar()
      .subscribe({ error: (value) => (error = value) });
    http
      .expectOne(`${environment.api.notificaciones}/notificaciones`)
      .flush([{ ...record, PAYLOAD: 'null' }]);
    expect(error?.message).toBe('El registro no contiene un evento válido.');
  });

  it('relaciona la auditoría con cliente, reserva y evento', () => {
    TestBed.inject(AuditoriaService)
      .listar()
      .subscribe((rows) => {
        expect(rows[0].eventoId).toBe('evt-1');
        expect(rows[0].reservaId).toBe('res-1');
        expect(rows[0].clienteId).toBe('cli-1');
      });
    http.expectOne(`${environment.api.auditoria}/auditoria`).flush([record]);
  });
  it('traduce fecha y horario de las asignaciones devueltas por Java', () => {
    TestBed.inject(DisponibilidadService)
      .getAsignaciones()
      .subscribe((rows) => {
        expect(rows[0].mesaId).toBe('mesa-01');
        expect(rows[0].fechaReserva).toBe('2026-10-12');
        expect(rows[0].horaInicio).toBe('18:00:00');
      });
    http.expectOne(`${environment.api.disponibilidad}/asignaciones`).flush([
      {
        ASIGNACION_ID: 'asg-1',
        RESERVA_ID: 'res-1',
        MESA_ID: 'mesa-01',
        FECHA: '2026-10-12',
        HORA_INICIO: '18:00:00',
        HORA_FIN: '20:00:00',
      },
    ]);
  });
});
