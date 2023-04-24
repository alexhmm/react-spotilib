// Types
import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyTrack,
  SpotifyTrackMetaData,
} from '../../shared/types/spotify.types';

export interface SaveTracksPutRequest {
  ids: string[];
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

export interface TrackAlbumData {
  album: Pick<SpotifyAlbum, 'id' | 'images' | 'name' | 'type' | 'uri'>;
}

export interface TrackArtists {
  artists: TrackArtist[];
}

export interface TrackCardAlbumData {
  album: Pick<SpotifyAlbum, 'images' | 'name'>;
}

export interface TrackCardArtistsData {
  artists: TrackCardArtist[];
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

export type Track = Pick<SpotifyTrack, 'id' | 'duration_ms' | 'name' | 'uri'> &
  TrackAlbumData &
  TrackArtists;

export type TrackArtist = Pick<SpotifyArtist, 'id' | 'name'>;

export type TrackCard = Pick<
  SpotifyTrack,
  'id' | 'duration_ms' | 'name' | 'uri'
> &
  TrackCardAlbumData &
  TrackCardArtistsData;

export type TrackCardArtist = Pick<SpotifyArtist, 'id' | 'name'>;
