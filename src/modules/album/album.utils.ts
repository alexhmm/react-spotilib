// Types
import { AlbumCard, SavedAlbumCard } from './album.types';
import {
  SpotifyAlbum,
  SpotifyArtistAlbum,
} from '../../shared/types/spotify.types';
import { SavedAlbum } from '../user/user.types';

/**
 * Map spotify album data.
 * @param albums Albums
 * @returns Mapped albums.
 */
export const albumDataMap = (
  albums: SpotifyAlbum[] | SpotifyArtistAlbum[]
): AlbumCard[] => {
  return albums.map((album) => {
    return {
      id: album.id,
      artists: album.artists,
      images: album.images,
      name: album.name,
      release_date: album.release_date,
      uri: album.uri,
    };
  });
};

/**
 * Map spotify saved album data.
 * @param albums Saved albums
 * @returns Mapped saved albums.
 */
export const savedAlbumDataMap = (albums: SavedAlbum[]): SavedAlbumCard[] => {
  return albums.map((album) => {
    return {
      id: album.album.id,
      added_at: album.added_at,
      artists: album.album.artists,
      images: album.album.images,
      name: album.album.name,
      release_date: album.album.release_date,
      uri: album.album.uri,
    };
  });
};
