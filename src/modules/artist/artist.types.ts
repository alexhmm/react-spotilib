// Types
import { SpotifyArtist } from '../../shared/types/spotify.types';

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
