import { HttpErrorResponse } from '@angular/common/http';
export function errorMessage(error: unknown): string {
  if (!(error instanceof HttpErrorResponse))
    return 'No se pudo completar la acción. Inténtalo nuevamente.';
  switch (error.status) {
    case 0:
      return 'No podemos conectar con el servicio. Comprueba tu conexión e inténtalo nuevamente.';
    case 400:
      return 'Revisa los datos ingresados. La solicitud contiene información inválida.';
    case 401:
      return 'Tu sesión no está activa. Inicia sesión nuevamente para continuar.';
    case 403:
      return 'Tu cuenta no tiene permiso para realizar esta acción.';
    case 404:
      return 'No encontramos el registro solicitado. Actualiza la información.';
    case 409:
      return 'No hay una mesa disponible para ese horario y cantidad de personas. Prueba otra fecha u horario.';
    default:
      return 'El servicio no pudo completar la acción. Inténtalo nuevamente en unos minutos.';
  }
}
