// Types
import { FollowingStateGetRequest } from '../../shared/types/shared.types';
import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyDataGetResponse,
  SpotifyFollowType,
  SpotifyMarket,
} from '../../shared/types/spotify.types';

export interface FollowedArtistsGetRequest {
  after?: string;
  limit?: number;
  type: string;
}

export interface FollowedArtistsGetResponse {
  artists: SpotifyDataGetResponse<SpotifyArtist[]>;
}

export interface SavedAlbum {
  added_at: string;
  album: SpotifyAlbum;
}

export interface SavedAlbumsGetParams {
  limit?: number;
  market?: SpotifyMarket;
  offset?: number;
}

export interface UserFollowingStateGetRequest extends FollowingStateGetRequest {
  type: SpotifyFollowType;
}

export interface UserImage {
  height: null;
  url: string;
  width: null;
}

export interface UserProfile {
  country?: string;
  display_name: string;
  email?: string;
  explicit_content?: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: null;
    total: number;
  };
  href: string;
  id: string;
  images: UserImage[];
  product?: string;
  type: string;
  uri: string;
}

export type FollowingStatePutDeleteRequest = Pick<
  UserFollowingStateGetRequest,
  'ids'
>;
