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

export interface QueueResponse extends QueueRequest {
  vhost?: string;
  messages?: number;
}

export interface ExchangeResponse extends ExchangeRequest {
  durable: boolean;
  vhost?: string;
}

export interface BindingResponse {
  queue: string;
  exchange: string;
  routingKey: string;
}
