// Hooks
import useFetch from '../../shared/hooks/use-fetch.hook';

// Types
import { RequestMethod } from '../../shared/types/shared.types';
import {
  FollowedArtistsGetRequest,
  FollowedArtistsGetResponse,
  FollowingStateGetRequest,
  FollowingStatePutDeleteRequest,
} from './user.types';

const useUserHttp = () => {
  const { fetchData } = useFetch();

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
    params: FollowingStateGetRequest
  ): Promise<boolean[] | undefined> => {
    return await fetchData(
      'me/following/contains',
      params && {
        params: new URLSearchParams({
          ids: params.ids.toString(),
          type: params.type.toString(),
        }),
      }
    );
  };

  /**
   * PUT Add or remove the current user as a follower of one or more artists or other Spotify users.
   * @param data FollowingStatePutDeleteRequest, FollowingStateGetParamsRequest
   * @returns Artist or user followed or unfollowed message.
   */
  const followingStatePutDelete = async (data: {
    body: FollowingStatePutDeleteRequest;
    method: RequestMethod;
    params: FollowingStateGetRequest;
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

  return {
    followedArtistsGet,
    followingStateGet,
    followingStatePutDelete,
  };
};

export default useUserHttp;
