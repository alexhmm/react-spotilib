// Types
import { ArtistCard } from './artist.types';
import { SpotifyArtist } from '../../shared/types/spotify.types';

/**
 * Map spotify artist data.
 * @param artists Artists
 * @returns Mapped artists.
 */
export const artistDataMap = (artists: SpotifyArtist[]): ArtistCard[] => {
  return artists.map((artist) => {
    return {
      id: artist.id,
      images: artist.images,
      name: artist.name,
      uri: artist.uri,
    };
  });
};
