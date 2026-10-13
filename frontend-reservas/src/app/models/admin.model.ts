export interface QueueRequest {
  name: string;
  durable: boolean;
}
export interface ExchangeRequest {
  name: string;
  type: 'direct' | 'fanout' | 'topic';
  durable: boolean;
}
export interface BindingRequest {
  queue: string;
  exchange: string;
  routingKey: string;
}
export interface QueueResponse extends QueueRequest {}
export interface ExchangeResponse extends ExchangeRequest {}
