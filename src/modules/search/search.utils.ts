// Types
import {
  SearchData,
  SearchGetResponse,
  SearchPlaylist,
  SearchTrack,
} from './search.types';

// Utils
import { mapAlbumData } from '../albums/albums.utils';
import { mapArtistData } from '../artists/artists.utils';

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
    searchData = {
      ...searchData,
      albums: mapAlbumData(searchGetResponse.albums),
    };
  }

  if (searchGetResponse.artists) {
    searchData = {
      ...searchData,
      artists: mapArtistData(searchGetResponse.artists),
    };
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
