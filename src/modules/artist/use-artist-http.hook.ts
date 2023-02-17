// Hooks
import useFetch from '../../shared/hooks/use-fetch.hook';

// Types
import {
  ArtistRelatedArtistsGetResponse,
  ArtistTopTracksGetResponse,
} from './artist.types';
import {
  SpotifyAlbumType,
  SpotifyArtist,
  SpotifyArtistAlbum,
  SpotifyDataGetResponse,
} from '../../shared/types/spotify.types';

const useArtistHttp = () => {
  const { fetchData } = useFetch();

  /**
   * GET Artist by id.
   * @param id Artist id
   * @returns Artist
   */
  const artistGet = async (id?: string): Promise<SpotifyArtist | undefined> => {
    if (id) {
      return await fetchData(`artists/${id}`);
    } else {
      return undefined;
    }
  };

  /**
   * GET Artist's albums by id, country and type.
   * @param id Artist id
   * @param country User country
   * @param type Album type
   * @returns Artist's albums
   */
  const albumsGet = async (
    id?: string,
    country?: string,
    type?: SpotifyAlbumType
  ): Promise<SpotifyDataGetResponse<SpotifyArtistAlbum[]> | undefined> => {
    if (id && country) {
      return await fetchData(`artists/${id}/albums`, {
        params: new URLSearchParams({
          market: country ? country.toString() : '',
          include_groups: type ? type.toString() : 'album,single,compilation',
        }),
      });
    } else {
      return undefined;
    }
  };

  /**
   * GET Related artists by artost id.
   * @param id Artist id
   * @returns Related artists
   */
  const relatedArtistsGet = async (
    id?: string
  ): Promise<ArtistRelatedArtistsGetResponse | undefined> => {
    if (id) {
      return await fetchData(`artists/${id}/related-artists`);
    } else {
      return undefined;
    }
  };

  /**
   * GET Artist's top tracks by id and country.
   * @param id Artist id
   * @param country User country
   * @returns Artist's top tracks
   */
  const topTracksGet = async (
    id?: string,
    country?: string
  ): Promise<ArtistTopTracksGetResponse | undefined> => {
    if (id && country) {
      // return await fetchData(`artists/${id}/top-tracks?market=${language}`);
      return await fetchData(`artists/${id}/top-tracks`, {
        params: new URLSearchParams({
          market: country ? country.toString() : '',
        }),
      });
    } else {
      return undefined;
    }
  };

  return {
    albumsGet,
    artistGet,
    relatedArtistsGet,
    topTracksGet,
  };
};

export default useArtistHttp;
