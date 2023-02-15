// Types
import { SpotifyTrack } from '../types/spotify.types';
import { TrackCard, TrackCardArtist } from '../types/track.types';

/**
 * Map spotify track data.
 * @param tracks Tracks
 * @returns Mapped tracks
 */
export const trackDataMap = (tracks: SpotifyTrack[]): TrackCard[] => {
  return tracks.map((track) => {
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
