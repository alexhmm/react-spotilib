// Types
import { ArtistCard } from './artists.types';
import {
  SpotifyArtist,
  SpotifyDataGetResponse,
} from '../../shared/types/spotify.types';

/**
 * Map spotify artist data.
 * @param artists Artists
 * @returns Mapped artists.
 */
export const mapArtistData = (
  artists: SpotifyDataGetResponse<SpotifyArtist[]>
): ArtistCard[] => {
  return artists.items.map((artist) => {
    return {
      id: artist.id,
      images: artist.images,
      name: artist.name,
      uri: artist.uri,
    };
  });
};
