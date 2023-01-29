// Types
import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyTrack,
  SpotifyTrackMetaData,
} from '../../shared/types/spotify.types';

export interface TrackCardAlbumData {
  album: Pick<SpotifyAlbum, 'images' | 'name'>;
}

export interface TrackCardArtistsData {
  artists: TrackCardArtist[];
}

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
  items: SpotifyTrackMetaData[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  previous: null;
  next: string;
}

export type TrackCard = Pick<
  SpotifyTrack,
  'id' | 'duration_ms' | 'name' | 'uri'
> &
  TrackCardAlbumData &
  TrackCardArtistsData;

export type TrackCardArtist = Pick<SpotifyArtist, 'id' | 'name'>;
