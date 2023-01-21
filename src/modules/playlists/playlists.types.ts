// Types
import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyPlaylist,
  SpotifyTrack,
  TrackMetaData,
} from '../../shared/types/spotify.types';

export interface PlaylistTracks {
  tracks: PlaylistTrack[];
}

export interface PlaylistTracksTotal {
  tracks_total: number;
}

export interface PlaylistTrackAlbum {
  album: Pick<SpotifyAlbum, 'id' | 'images' | 'name'>;
}

export interface PlaylistTrackArtists {
  artists: PlaylistTrackArtist[];
}

export interface PlaylistsGetParams {
  limit: number;
  offset: number;
}

export interface PlaylistsGetResponse {
  href: string;
  items: SpotifyPlaylist[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

export type Playlists = Pick<
  PlaylistsGetResponse,
  'items' | 'limit' | 'offset' | 'total'
>;

export type Playlist = Pick<
  SpotifyPlaylist,
  'description' | 'id' | 'images' | 'name' | 'owner' | 'public' | 'uri'
> &
  PlaylistTracks &
  PlaylistTracksTotal;

export type PlaylistTrack = Pick<
  SpotifyTrack,
  'duration_ms' | 'id' | 'name' | 'uri'
> &
  Pick<TrackMetaData, 'added_at' | 'added_by'> &
  PlaylistTrackAlbum &
  PlaylistTrackArtists;

export type PlaylistTrackArtist = Pick<SpotifyArtist, 'id' | 'name'>;
