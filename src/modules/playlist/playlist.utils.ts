// Types
import { Playlist, PlaylistCard, PlaylistTrack } from './playlist.types';
import {
  SpotifyPlaylist,
  SpotifyTrackMetaData,
} from '../../shared/types/spotify.types';
import { TrackArtist } from '../track/track.types';

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
 * Map spotify playlist data.
 * @param playlists Playlists
 * @returns Mapped playlists.
 */
export const playlistDataMap = (
  playlists: SpotifyPlaylist[]
): PlaylistCard[] => {
  return playlists.map((playlist) => {
    return {
      id: playlist.id,
      description: playlist.description,
      images: playlist.images,
      name: playlist.name,
      owner: playlist.owner,
      uri: playlist.uri,
    };
  });
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
    const artists: TrackArtist[] = [];

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
        type: track.track.type,
        uri: track.track.uri,
      },
      artists,
      duration_ms: track.track.duration_ms,
      name: track.track.name,
      uri: track.track.uri,
    });
  }

  return tracks;
};

/**
 * Utility function to remove specified tracks from playlist.
 * @param playlist Playlist
 * @param removedTracks Removed tracks
 * @returns Playlist without removed tracks.
 */
export const removePlaylistItemsEffect = (
  playlist: Playlist,
  removedTracks: { uri: string }[]
): Playlist => {
  const updatedPlaylistTracks = [...playlist.tracks];
  for (const removedTrack of removedTracks) {
    const index = updatedPlaylistTracks.findIndex(
      (track) => track.uri === removedTrack.uri
    );
    if (index > -1) {
      updatedPlaylistTracks.splice(index, 1);
    }
  }

  const updatedPlaylist: Playlist = {
    ...playlist,
    tracks: updatedPlaylistTracks,
    tracks_total: playlist.tracks_total - removedTracks.length,
  };

  return updatedPlaylist;
};
