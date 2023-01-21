// Types
import { SpotifyTrack, TrackMetaData } from '../../shared/types/spotify.types';

export interface TopTracksGetResponse {
  items: SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  previous: null;
  next: string;
}
export interface TracksGetResponse {
  items: TrackMetaData[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  previous: null;
  next: string;
}
