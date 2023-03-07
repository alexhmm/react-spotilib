import { useMutation } from 'react-query';

// Hooks
import useFetch from '../../shared/hooks/use-fetch.hook';

// Types
import { RequestMethod } from '../../shared/types/shared.types';
import {
  SpotifyDataGetResponse,
  SpotifyPlaylist,
} from '../../shared/types/spotify.types';
import { PlaylistsGetParams } from '../playlist/playlist.types';
import {
  FollowedArtistsGetRequest,
  FollowedArtistsGetResponse,
  UserFollowingStateGetRequest,
  FollowingStatePutDeleteRequest,
  SavedAlbumsGetParams,
  SavedAlbum,
  UserProfile,
  SavedAlbumsCheckGetRequest,
  SaveAlbumsPutDeleteRequest,
} from './user.types';

// Stores
import useSharedStore from '../../shared/stores/use-shared.store';

const useUserHttp = () => {
  const { fetchData, handleError, handleRetry } = useFetch();

  // Shared store state
  const [setFollowingState, setNotification] = useSharedStore((state) => [
    state.setFollowing,
    state.setNotification,
  ]);

  /**
   * GET Current user's followed artists.
   * @param params FollowedArtistsGetRequest
   * @returns Current user's followed artists.
   */
  const followedArtistsGet = async (
    params: FollowedArtistsGetRequest
  ): Promise<FollowedArtistsGetResponse | undefined> => {
    const urlSearchParams = new URLSearchParams({
      type: params.type.toString(),
    });
    params.after && urlSearchParams.append('after', params.after);
    params.limit && urlSearchParams.append('limit', params.limit.toString());

    return await fetchData('me/following', {
      params: urlSearchParams,
    });
  };

  /**
   * GET Check to see if the current user is following one or more artists or other Spotify users.
   * @param params FollowingStateGetPutRequest
   * @returns Array of booleans.
   */
  const followingStateGet = async (
    params: UserFollowingStateGetRequest
  ): Promise<boolean[] | undefined> => {
    return await fetchData('me/following/contains', {
      params: new URLSearchParams({
        ids: params.ids.toString(),
        type: params.type.toString(),
      }),
    });
  };

  /**
   * PUT Add or remove the current user as a follower of one or more artists or other Spotify users.
   * @param data FollowingStatePutDeleteRequest, FollowingStateGetParamsRequest
   * @returns Artist or user followed or unfollowed message.
   */
  const followingStatePutDelete = async (data: {
    body: FollowingStatePutDeleteRequest;
    method: RequestMethod;
    params: UserFollowingStateGetRequest;
  }): Promise<boolean[] | undefined> => {
    return await fetchData('me/following', {
      body: data.body,
      params: new URLSearchParams({
        ids: data.params.ids.toString(),
        type: data.params.type.toString(),
      }),
      method: data.method,
    });
  };

  /**
   * PUT / DELETE Following state mutation
   */
  const followingStatePutDeleteMutation = useMutation(
    (data: {
      body: FollowingStatePutDeleteRequest;
      deleteSuccessMessage: string;
      method: RequestMethod;
      params: UserFollowingStateGetRequest;
      putSuccessMessage: string;
    }) => followingStatePutDelete(data),
    {
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          handleError(errRes.status);
        }
      },
      onSuccess: (data, variables) => {
        setFollowingState(
          variables.method === RequestMethod.Put ? true : false
        );
        setNotification({
          title:
            variables.method === RequestMethod.Put
              ? variables.putSuccessMessage
              : variables.deleteSuccessMessage,
        });
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  /**
   * GET List of the playlists owned or followed by a Spotify user.
   * @param params PlaylistGetParams
   * @returns User playlists
   */
  const playlistsGet = async (
    params?: PlaylistsGetParams
  ): Promise<SpotifyDataGetResponse<SpotifyPlaylist[]> | undefined> => {
    return await fetchData(
      'me/playlists',
      params && {
        params: new URLSearchParams({
          limit: params.limit.toString(),
          offset: params.offset.toString(),
        }),
      }
    );
  };

  /**
   * GET Public profile information about a Spotify user.
   * @param id User id
   * @returns UserProfile
   */
  const profileGet = async (id: string): Promise<UserProfile | undefined> => {
    return await fetchData(`users/${id}`);
  };

  /**
   * GET List of the albums saved in the current Spotify user's 'Your Music' library.
   * @param params SavedAlbumsGetRequest
   * @returns Pages of albums
   */
  const savedAlbumsGet = async (
    params: SavedAlbumsGetParams
  ): Promise<SpotifyDataGetResponse<SavedAlbum[]> | undefined> => {
    const urlSearchParams = new URLSearchParams();
    params.limit && urlSearchParams.append('limit', params.limit.toString());
    params.market && urlSearchParams.append('market', params.market);
    params.offset && urlSearchParams.append('offset', params.offset.toString());

    return await fetchData('me/albums', {
      params: urlSearchParams,
    });
  };

  /**
   * GET Check if one or more albums is already saved in the current Spotify user's 'Your Music' library.
   * @param params Album ids
   * @returns Array of booleans
   */
  const savedAlbumsCheckGet = async (
    params: SavedAlbumsCheckGetRequest
  ): Promise<boolean[] | undefined> => {
    if (params.ids.length > 0) {
      return await fetchData(`me/albums/contains`, {
        params: new URLSearchParams({
          ids: params.ids.toString(),
        }),
      });
    }
  };

  /**
   * DELETE Remove one or more albums from the current user's 'Your Music' library.
   * @param params Album ids
   * @returns Message
   */
  const savedAlbumsDelete = async (
    params: SaveAlbumsPutDeleteRequest
  ): Promise<any> => {
    console.log('savedAlbumsDelete', params.ids);
    if (params.ids.length > 0) {
      return await fetchData('me/albums', {
        params: new URLSearchParams({
          ids: params.ids.toString(),
        }),
        method: RequestMethod.Delete,
      });
    }
  };

  /**
   * PUT Save one or more albums to the current user's 'Your Music' library.
   * @param params Album ids
   * @returns Message
   */
  const saveAlbumsPut = async (
    params: SaveAlbumsPutDeleteRequest
  ): Promise<any> => {
    if (params.ids.length > 0) {
      return await fetchData('me/albums', {
        params: new URLSearchParams({
          ids: params.ids.toString(),
        }),
        method: RequestMethod.Put,
      });
    }
  };

  return {
    followedArtistsGet,
    followingStateGet,
    followingStatePutDeleteMutation,
    playlistsGet,
    profileGet,
    savedAlbumsGet,
    savedAlbumsCheckGet,
    savedAlbumsDelete,
    saveAlbumsPut,
  };
};

export default useUserHttp;
