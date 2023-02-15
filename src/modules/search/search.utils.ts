// Types
import { SearchData, SearchGetResponse } from './search.types';

// Utils
import { albumDataMap } from '../album/album.utils';
import { artistDataMap } from '../artist/artist.utils';
import { playlistDataMap } from '../playlist/playlist.utils';
import { trackDataMap } from '../../shared/utils/track.utils';

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
      albums: albumDataMap(searchGetResponse.albums.items),
    };
  }

  if (searchGetResponse.artists) {
    searchData = {
      ...searchData,
      artists: artistDataMap(searchGetResponse.artists.items),
    };
  }

  if (searchGetResponse.playlists) {
    searchData = {
      ...searchData,
      playlists: playlistDataMap(searchGetResponse.playlists.items),
    };
  }

  if (searchGetResponse.tracks) {
    searchData = {
      ...searchData,
      tracks: trackDataMap(searchGetResponse.tracks.items),
    };
  }

  return searchData;
};
