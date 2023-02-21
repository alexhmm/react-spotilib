// Types
import {
  SpotifyArtist,
  SpotifyDataGetResponse,
  SpotifyFollowType,
} from '../../shared/types/spotify.types';

export interface FollowingStateGetRequest {
  ids: string[];
  type: SpotifyFollowType;
}

export interface FollowedArtistsGetRequest {
  after?: string;
  limit?: number;
  type: string;
}

export interface FollowedArtistsGetResponse {
  artists: SpotifyDataGetResponse<SpotifyArtist[]>;
}

export interface UserImage {
  height: null;
  url: string;
  width: null;
}

export interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
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
  product: string;
  type: string;
  uri: string;
}

export type FollowingStatePutDeleteRequest = Pick<
  FollowingStateGetRequest,
  'ids'
>;
