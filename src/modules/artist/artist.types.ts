// Types
import {
  SpotifyArtist,
  SpotifyMarket,
  SpotifyTrack,
} from '../../shared/types/spotify.types';

export interface ArtistAlbumsGetParams {
  limit?: number;
  market?: SpotifyMarket;
  offset?: number;
  include_groups?: string;
}

export interface ArtistRelatedArtistsGetResponse {
  artists: SpotifyArtist[];
}

export interface ArtistTopTracksGetResponse {
  tracks: SpotifyTrack[];
}

export interface TopArtistsGetResponse {
  items: SpotifyArtist[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  previous: null;
  next: string;
}

export type ArtistCard = Pick<SpotifyArtist, 'id' | 'images' | 'name' | 'uri'>;
