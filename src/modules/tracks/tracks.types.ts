import { ExternalUrls } from '../../shared/types/shared.types';

export interface Track {
  added_at: string;
  added_by: {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: false;
  primary_color: any;
  track: TrackDetail;
  video_thumbnail: { url: any };
}

export interface TopTracksGetResponse {
  items: TrackDetail[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  previous: null;
  next: string;
}

export interface TrackDetail {
  album: any;
  artists: any[];
  available_markets: any[];
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: any;
  external_urls: any;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
}
