import { SpotifyAlbum, SpotifyTrack } from '../../shared/types/spotify.types';
import { SavedAlbum } from '../user/user.types';

export interface AlbumWithDuration extends SpotifyAlbum {
  duration_ms: number;
}

export type AlbumCard = Pick<
  SpotifyAlbum,
  'artists' | 'id' | 'images' | 'name' | 'release_date' | 'uri'
>;

export type AlbumTrack = Omit<SpotifyTrack, 'album'>;

export type SavedAlbumAddedAd = Pick<SavedAlbum, 'added_at'>;

export type SavedAlbumCard = AlbumCard & SavedAlbumAddedAd;
