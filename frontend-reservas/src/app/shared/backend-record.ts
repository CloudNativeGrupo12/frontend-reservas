export interface BackendRecord {
  EVENTO_ID: string;
  RESERVA_ID: string;
  PAYLOAD: string;
  RESULTADO: string;
  PROCESADO_EN: string;
}
export function eventPayload(row: BackendRecord): Record<string, unknown> {
  try {
    const data: unknown = JSON.parse(row.PAYLOAD);
    return data && typeof data === 'object' && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
export function text(data: Record<string, unknown>, key: string): string | undefined {
  return typeof data[key] === 'string' ? (data[key] as string) : undefined;
}
