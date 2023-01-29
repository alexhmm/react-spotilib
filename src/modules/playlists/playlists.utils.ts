// Types
import {
  Playlist,
  PlaylistTrack,
  PlaylistTrackArtist,
} from './playlists.types';
import {
  SpotifyPlaylist,
  SpotifyTrackMetaData,
} from '../../shared/types/spotify.types';

/**
 * Create playlist data by fetched spotify playlist.
 * @param fetchedPlaylist SpotifyPlaylist
 * @returns Playlist
 */
export const playlistCreate = (fetchedPlaylist: SpotifyPlaylist): Playlist => {
  // Map spotify track data
  const tracks = playlistTracksMap(fetchedPlaylist.tracks.items);

  return {
    description: fetchedPlaylist.description,
    id: fetchedPlaylist.id,
    images: fetchedPlaylist.images,
    name: fetchedPlaylist.name,
    owner: fetchedPlaylist.owner,
    public: fetchedPlaylist.public,
    tracks,
    tracks_total: fetchedPlaylist.tracks.total,
    uri: fetchedPlaylist.uri,
  };
};

/**
 * Map spotify playlist track data.
 * @param tracksSpotify Spotify tracks array
 * @returns Mapped playlist tracks
 */
export const playlistTracksMap = (
  tracksSpotify: SpotifyTrackMetaData[]
): PlaylistTrack[] => {
  const tracks: PlaylistTrack[] = [];

  for (let track of tracksSpotify) {
    const artists: PlaylistTrackArtist[] = [];

    for (let artist of track.track.artists) {
      artists.push({
        id: artist.id,
        name: artist.name,
      });
    }

    tracks.push({
      id: track.track.id,
      added_at: track.added_at,
      added_by: track.added_by,
      album: {
        id: track.track.album.id,
        images: track.track.album.images,
        name: track.track.album.name,
      },
      artists,
      duration_ms: track.track.duration_ms,
      name: track.track.name,
      uri: track.track.uri,
    });
  }

  return tracks;
};
