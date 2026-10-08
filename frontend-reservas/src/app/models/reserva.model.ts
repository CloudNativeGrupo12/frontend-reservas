export interface ReservaSolicitud {
  clienteId: string;
  emailCliente: string;
  fechaReserva: string;
  horaInicio: string;
  horaFin: string;
  cantidadPersonas: number;
}

export interface Reserva {
  reservaId: string;
  eventoId: string;
  clienteId: string;
  emailCliente: string;
  mesaId: string;
  fechaReserva: string;
  horaInicio: string;
  horaFin: string;
  cantidadPersonas: number;
  estado: string;
  publicacion: string;
}
