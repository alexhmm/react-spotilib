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
import { TrackCard } from '../tracks/tracks.types';

export interface SearchData {
  albums?: AlbumCard[];
  artists?: ArtistCard[];
  playlists?: SearchPlaylist[];
  tracks?: TrackCard[];
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

export type SearchPlaylist = Pick<
  SpotifyPlaylist,
  'id' | 'images' | 'name' | 'owner' | 'uri'
>;
