// Types
import {
  SpotifyDataGetResponse,
  SpotifyTrack,
} from '../../shared/types/spotify.types';
import { TrackCard, TrackCardArtist } from './track.types';

/**
 * Map spotify track data.
 * @param tracks Tracks
 * @returns Mapped tracks
 */
export const trackDataMap = (
  tracks: SpotifyDataGetResponse<SpotifyTrack[]>
): TrackCard[] => {
  return tracks.items.map((track) => {
    const artists: TrackCardArtist[] = track.artists.map((artist) => {
      return {
        id: artist.id,
        name: artist.name,
      };
    });
    return {
      id: track.id,
      artists,
      duration_ms: track.duration_ms,
      album: {
        images: track.album.images,
        name: track.album.name,
      },
      name: track.name,
      uri: track.uri,
    };
  });
};
