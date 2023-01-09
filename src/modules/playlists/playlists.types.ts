import { ExternalUrls } from '../../shared/types/shared.types';
// import { Track } from '../tracks/tracks.types';

export interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  followers: PlaylistFollowers;
  href: string;
  id: string;
  images: PlaylistImage[];
  name: string;
  owner: PlaylistOwner;
  primary_color: any;
  public: boolean;
  snapshot_id: string;
  tracks: PlaylistTracks;
  type: string;
  uri: string;
}

export interface PlaylistFollowers {
  href: string;
  total: number;
}

export interface PlaylistImage {
  height: number;
  url: string;
  width: number;
}

export interface PlaylistOwner {
  id: string;
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
}

export interface PlaylistTracks {
  href: string;
  //   items: Track[];
  items: any[];
  total: number;
}

export interface PlaylistsGetParams {
  limit: number;
  offset: number;
}

export interface PlaylistsGetResponse {
  href: string;
  items: Playlist[];
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
