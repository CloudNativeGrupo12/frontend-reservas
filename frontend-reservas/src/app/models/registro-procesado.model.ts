export interface RegistroProcesado {
  EVENTO_ID: string;
  RESERVA_ID: string;
  PAYLOAD: string;
  RESULTADO: string;
  PROCESADO_EN: string;
}

export function datosEvento(payload: string): { emailCliente?: string; clienteId?: string; tipoEvento?: string } {
  const parsed: unknown = JSON.parse(payload);
  if (!parsed || typeof parsed !== 'object') throw new Error('El registro no contiene un evento válido.');
  const event = parsed as Record<string, unknown>;
  return {
    emailCliente: typeof event['emailCliente'] === 'string' ? event['emailCliente'] : undefined,
    clienteId: typeof event['clienteId'] === 'string' ? event['clienteId'] : undefined,
    tipoEvento: typeof event['tipoEvento'] === 'string' ? event['tipoEvento'] : undefined,
  };
}
