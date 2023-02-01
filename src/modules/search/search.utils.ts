// Types
import { SearchData, SearchGetResponse } from './search.types';

// Utils
import { albumDataMap } from '../albums/albums.utils';
import { artistDataMap } from '../artist/artist.utils';
import { playlistDataMap } from '../playlist/playlist.utils';
import { trackDataMap } from '../tracks/tracks.utils';

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
      albums: albumDataMap(searchGetResponse.albums),
    };
  }

  if (searchGetResponse.artists) {
    searchData = {
      ...searchData,
      artists: artistDataMap(searchGetResponse.artists),
    };
  }

  if (searchGetResponse.playlists) {
    searchData = {
      ...searchData,
      playlists: playlistDataMap(searchGetResponse.playlists),
    };
  }

  if (searchGetResponse.tracks) {
    searchData = {
      ...searchData,
      tracks: trackDataMap(searchGetResponse.tracks),
    };
  }

  return searchData;
};
