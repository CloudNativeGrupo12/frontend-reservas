import { FormControl, FormGroup } from '@angular/forms';
import { localToday, requiredText, reservationSchedule } from './reservation-validation';
import { HttpErrorResponse } from '@angular/common/http';
import { errorMessage } from './http-error';

describe('Validación de reservas', () => {
  const schedule = (fecha: string, inicio: string, fin: string) =>
    new FormGroup({
      fechaReserva: new FormControl(fecha),
      horaInicio: new FormControl(inicio),
      horaFin: new FormControl(fin),
    });
  it('rechaza una fecha pasada', () => {
    expect(reservationSchedule(schedule('2000-01-01', '18:00', '19:00'))).toEqual({
      pastDate: true,
    });
  });
  it('rechaza intervalos invertidos o de duración cero', () => {
    expect(reservationSchedule(schedule(localToday(), '20:00', '19:00'))).toEqual({
      invalidInterval: true,
    });
    expect(reservationSchedule(schedule(localToday(), '20:00', '20:00'))).toEqual({
      invalidInterval: true,
    });
  });
  it('permite hoy con un horario posterior', () => {
    expect(reservationSchedule(schedule(localToday(), '18:00', '20:00'))).toBeNull();
  });
  it('rechaza una referencia compuesta solo por espacios', () => {
    expect(requiredText(new FormControl('   '))).toEqual({ required: true });
  });
  it('presenta recuperación para errores de sesión y disponibilidad', () => {
    expect(errorMessage(new HttpErrorResponse({ status: 401 }))).toContain('Inicia sesión');
    expect(errorMessage(new HttpErrorResponse({ status: 409 }))).toContain('otra fecha');
    expect(errorMessage(new HttpErrorResponse({ status: 0 }))).toContain('conexión');
  });
});
