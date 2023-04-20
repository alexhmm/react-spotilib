// Hooks
import useFetch from '../../shared/hooks/use-fetch.hook';

// Types
import {
  ArtistAlbumsGetParams,
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
    id: string | undefined,
    params: ArtistAlbumsGetParams
  ): Promise<SpotifyDataGetResponse<SpotifyArtistAlbum[]> | undefined> => {
    if (id && params.market) {
      const urlSearchParams = new URLSearchParams({
        market: params.market ? params.market.toString() : '',
      });

      let include_groups = 'album,single,compilation';
      if (
        params.include_groups === SpotifyAlbumType.Album ||
        params.include_groups === SpotifyAlbumType.AppearsOn ||
        params.include_groups === SpotifyAlbumType.Compilation ||
        params.include_groups === SpotifyAlbumType.Single
      ) {
        include_groups = params.include_groups;
      }

      urlSearchParams.append('include_groups', include_groups);
      params.limit && urlSearchParams.append('limit', params.limit.toString());
      params.offset &&
        urlSearchParams.append('offset', params.offset.toString());

      return await fetchData(`artists/${id}/albums`, {
        params: urlSearchParams,
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
