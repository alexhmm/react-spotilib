import { AlbumCard } from '../albums/albums.types';
import {
  SearchArtist,
  SearchData,
  SearchGetResponse,
  SearchPlaylist,
  SearchTrack,
} from './search.types';

/**
 * Map spotify search data.
 * @param searchGetResponse SearchGetResponse
 * @returns SearchData
 */
export const searchDataCreate = (
  searchGetResponse: SearchGetResponse
): SearchData => {
  let searchData: SearchData = {};

  if (searchGetResponse.albums) {
    const albums: AlbumCard[] = [];
    for (const album of searchGetResponse.albums.items) {
      albums.push({
        id: album.id,
        artists: album.artists,
        images: album.images,
        name: album.name,
        release_date: album.release_date,
        uri: album.uri,
      });
    }
    searchData = { ...searchData, albums };
  }

  if (searchGetResponse.artists) {
    const artists: SearchArtist[] = [];
    for (const album of searchGetResponse.artists.items) {
      artists.push({
        id: album.id,
        images: album.images,
        name: album.name,
        uri: album.uri,
      });
    }
    searchData = { ...searchData, artists };
  }

  if (searchGetResponse.playlists) {
    const playlists: SearchPlaylist[] = [];
    for (const playlist of searchGetResponse.playlists.items) {
      playlists.push({
        id: playlist.id,
        images: playlist.images,
        name: playlist.name,
        owner: playlist.owner,
        uri: playlist.uri,
      });
    }
    searchData = { ...searchData, playlists };
  }

  if (searchGetResponse.tracks) {
    const tracks: SearchTrack[] = [];
    for (const track of searchGetResponse.tracks.items) {
      tracks.push({
        id: track.id,
        duration_ms: track.duration_ms,
        name: track.name,
        uri: track.uri,
      });
    }
    searchData = { ...searchData, tracks };
  }

  return searchData;
};
