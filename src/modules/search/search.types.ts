// Types
import { AlbumCard } from '../albums/albums.types';
import { ArtistCard } from '../artists/artists.types';
import {
  SpotifyItemType,
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyDataGetResponse,
  SpotifyPlaylist,
  SpotifyTrack,
} from '../../shared/types/spotify.types';

export interface SearchData {
  albums?: AlbumCard[];
  artists?: ArtistCard[];
  playlists?: SearchPlaylist[];
  tracks?: SearchTrack[];
}

export interface SearchGetParams {
  q: string;
  type: SpotifyItemType[];
}

export interface SearchGetResponse {
  albums: SpotifyDataGetResponse<SpotifyAlbum[]>;
  artists: SpotifyDataGetResponse<SpotifyArtist[]>;
  playlists: SpotifyDataGetResponse<SpotifyPlaylist[]>;
  tracks: SpotifyDataGetResponse<SpotifyTrack[]>;
}

export type SearchTrack = Pick<
  SpotifyTrack,
  'duration_ms' | 'id' | 'name' | 'uri'
>;

export type SearchPlaylist = Pick<
  SpotifyPlaylist,
  'id' | 'images' | 'name' | 'owner' | 'uri'
>;
