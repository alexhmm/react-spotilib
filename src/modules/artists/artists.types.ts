import {
  ExternalUrls,
  Followers,
  Image,
} from '../../shared/types/shared.types';

export enum Type {
  Artist = 'artist',
}

export interface Artist {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: Type;
  uri: string;
}

export interface TopArtistsGetResponse {
  items: Artist[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  previous: null;
  next: string;
}
