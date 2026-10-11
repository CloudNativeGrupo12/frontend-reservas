import { AbstractControl, ValidationErrors } from '@angular/forms';
export function localToday(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function requiredText(control: AbstractControl): ValidationErrors | null {
  return typeof control.value === 'string' && control.value.trim() ? null : { required: true };
}
export function reservationSchedule(control: AbstractControl): ValidationErrors | null {
  const date = control.get('fechaReserva')?.value as string;
  const start = control.get('horaInicio')?.value as string;
  const end = control.get('horaFin')?.value as string;
  const errors: ValidationErrors = {};
  if (date && date < localToday()) errors['pastDate'] = true;
  if (start && end && end <= start) errors['invalidInterval'] = true;
  return Object.keys(errors).length ? errors : null;
}
