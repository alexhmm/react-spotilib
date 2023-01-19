export interface Device {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export interface DevicesGetResponse {
  devices: Device[];
}

export interface PlayPutParams {
  device_id: string;
}

export interface PlayPutRequest {
  context_uri?: string;
  offset?: any;
  position_ms?: number;
  uris?: string[];
}
