import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { DisponibilidadService } from './disponibilidad.service';
import { NotificacionesService } from './notificaciones.service';
import { AuditoriaService } from './auditoria.service';

describe('Contratos reales de las APIs', () => {
  let http: HttpTestingController;
  const registro = {
    EVENTO_ID: 'evt-1', RESERVA_ID: 'res-1', PROCESADO_EN: '2026-10-08T18:00:00Z',
    PAYLOAD: JSON.stringify({ emailCliente: 'cliente@example.com', clienteId: 'cli-1', tipoEvento: 'ReservaConfirmada' }),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('muestra la ocupación devuelta en mayúsculas por Spring', () => {
    let actual: unknown;
    TestBed.inject(DisponibilidadService).getAsignaciones().subscribe((value) => actual = value);
    http.expectOne(`${environment.api.disponibilidad}/asignaciones`).flush([{
      ASIGNACION_ID: 'asg-1', RESERVA_ID: 'res-1', MESA_ID: 'mesa-02',
      FECHA: '2026-10-15', HORA_INICIO: '18:00:00', HORA_FIN: '20:00:00',
    }]);
    expect(actual).toEqual([{
      asignacionId: 'asg-1', reservaId: 'res-1', mesaId: 'mesa-02', fechaReserva: '2026-10-15',
      horaInicio: '18:00:00', horaFin: '20:00:00',
    }]);
  });
  it('muestra notificación, reserva, correo y resultado del registro real', () => {
    let actual: unknown;
    TestBed.inject(NotificacionesService).listar().subscribe((value) => actual = value);
    http.expectOne(`${environment.api.notificaciones}/notificaciones`).flush([{ ...registro, RESULTADO: 'CORREO_ENVIADO' }]);
    expect(actual).toEqual([{
      notificacionId: 'evt-1', reservaId: 'res-1', emailCliente: 'cliente@example.com',
      estado: 'CORREO_ENVIADO', timestamp: registro.PROCESADO_EN,
    }]);
  });
  it('muestra auditoría con el mismo evento y reserva', () => {
    let actual: unknown;
    TestBed.inject(AuditoriaService).listar().subscribe((value) => actual = value);
    http.expectOne(`${environment.api.auditoria}/auditoria`).flush([{ ...registro, RESULTADO: 'AUDITADA' }]);
    expect(actual).toEqual([{
      eventoId: 'evt-1', reservaId: 'res-1', tipo: 'ReservaConfirmada', clienteId: 'cli-1',
      resultado: 'AUDITADA', timestamp: registro.PROCESADO_EN,
    }]);
  });
  it('informa un payload inválido en lugar de inventar los datos del evento', () => {
    let error: Error | undefined;
    TestBed.inject(NotificacionesService).listar().subscribe({ error: (value: Error) => error = value });
    http.expectOne(`${environment.api.notificaciones}/notificaciones`).flush([{ ...registro, PAYLOAD: 'null', RESULTADO: 'CORREO_ENVIADO' }]);
    expect(error?.message).toBe('El registro no contiene un evento válido.');
  });
});
