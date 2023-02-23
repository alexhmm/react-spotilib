// Types
import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyDataGetResponse,
  SpotifyPlaylist,
  SpotifyTrack,
  SpotifyTrackMetaData,
} from '../../shared/types/spotify.types';

export interface PlaylistFollowPutRequest {
  public?: boolean;
}

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

export type Playlists = Pick<
  SpotifyDataGetResponse<SpotifyPlaylist[]>,
  'items' | 'limit' | 'offset' | 'total'
>;

export type Playlist = Pick<
  SpotifyPlaylist,
  'description' | 'id' | 'images' | 'name' | 'owner' | 'public' | 'uri'
> &
  PlaylistTracks &
  PlaylistTracksTotal;

export type PlaylistCard = Pick<
  SpotifyPlaylist,
  'id' | 'description' | 'images' | 'name' | 'owner' | 'uri'
>;

export type PlaylistTrack = Pick<
  SpotifyTrack,
  'duration_ms' | 'id' | 'name' | 'uri'
> &
  Pick<SpotifyTrackMetaData, 'added_at' | 'added_by'> &
  PlaylistTrackAlbum &
  PlaylistTrackArtists;

export type PlaylistTrackArtist = Pick<SpotifyArtist, 'id' | 'name'>;
