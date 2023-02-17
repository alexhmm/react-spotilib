// Types
import { AlbumCard } from './album.types';
import {
  SpotifyAlbum,
  SpotifyArtistAlbum,
} from '../../shared/types/spotify.types';

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
