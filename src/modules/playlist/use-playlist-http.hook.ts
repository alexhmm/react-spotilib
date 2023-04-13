import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';

// Hooks
import useFetch from '../../shared/hooks/use-fetch.hook';
import usePlaylist from './use-playlist.hook';

// Stores
import usePlaylistStore from './use-playlist.store';
import useSharedStore from '../../shared/stores/use-shared.store';

// Types
import {
  PlaylistFollowPutRequest,
  PlaylistItemsRemoveDeleteRequest,
  PlaylistsGetParams,
  PlaylistTracksAddPostRequest,
  PlaylistUpdateRequest,
} from './playlist.types';
import {
  FollowingStateGetRequest,
  RequestMethod,
} from '../../shared/types/shared.types';
import {
  SpotifyDataGetResponse,
  SpotifyPlaylist,
} from '../../shared/types/spotify.types';
import { TracksGetResponse } from '../../shared/types/track.types';

const usePlaylistHttp = () => {
  const { fetchData, handleError, handleRetry } = useFetch();
  const { playlistsAddEffect } = usePlaylist();
  const { t } = useTranslation();

  // Playlist store state
  const [setDrawerAddTrackToPlaylist] = usePlaylistStore((state) => [
    state.setAddTrackToPlaylist,
  ]);

  // Shared store state
  const [setNotification] = useSharedStore((state) => [state.setNotification]);

  // ######### //
  // MUTATIONS //
  // ######### //

  // GET Add Playlists mutation
  const playlistsAddMutation = useMutation(
    (data: { id: string; params?: PlaylistsGetParams }) => playlistsGet(data),
    {
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        try {
          data &&
            playlistsAddEffect({
              items: data.items,
              limit: data.limit,
              offset: data.offset,
              total: data.total,
            });
        } catch (error) {
          console.error('ERROR on adding playlists:', error);
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // GET Add tracks to playlists mutation
  const playlistTracksPostMutation = useMutation(
    (data: PlaylistTracksAddPostRequest) => playlistTracksPost(data),
    {
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        setNotification({
          title: t('track.action.add_to_playlist.success'),
        });
        setDrawerAddTrackToPlaylist(undefined);
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  /**
   * GET List of the playlists owned or followed by a Spotify user.
   * @param data Playlist id and PlaylistGetParams
   * @returns User playlists
   */
  const playlistsGet = async (data: {
    id: string;
    params?: PlaylistsGetParams;
  }): Promise<SpotifyDataGetResponse<SpotifyPlaylist[]> | undefined> => {
    const urlSearchParams = new URLSearchParams();
    data.params?.limit &&
      urlSearchParams.append('limit', data.params.limit.toString());
    data.params?.offset &&
      urlSearchParams.append('offset', data.params.offset.toString());

    return await fetchData(
      `users/${data.id}/playlists`,
      data.params && {
        params: new URLSearchParams({
          limit: data.params.limit.toString(),
          offset: data.params.offset.toString(),
        }),
      }
    );
  };

  /**
   * GET Playlist by id.
   * @returns Playlist
   */
  const playlistGet = async (
    id?: string
  ): Promise<SpotifyPlaylist | undefined> => {
    if (id) {
      return await fetchData(`playlists/${id}`);
    } else {
      return undefined;
    }
  };

  /**
   * PUT Change a playlist's name and public/private state by id (the user must, of course, own the playlist).
   * @param data Playlist id and PlaylistUpdateRequest
   * @returns Message
   */
  const playlistUpdate = async (data: {
    id: string;
    body: PlaylistUpdateRequest;
  }): Promise<SpotifyDataGetResponse<SpotifyPlaylist[]> | undefined> => {
    return await fetchData(`playlists/${data.id}`, {
      body: data.body,
      method: RequestMethod.Put,
    });
  };

  /**
   * GET Check to see if one or more Spotify users are following a specified playlist.
   * @param params FollowingStateGetPutRequest
   * @returns Array of booleans.
   */
  const playlistFollowGet = async (
    id: string,
    params: FollowingStateGetRequest
  ): Promise<boolean[] | undefined> => {
    if (id.length > 0 && params.ids.length > 0) {
      return await fetchData(`playlists/${id}/followers/contains`, {
        params: new URLSearchParams({
          ids: params.ids.toString(),
        }),
      });
    }
  };

  /**
   * DELETE Remove the current user as a follower of a playlist.
   * @param id Playlist id
   * @returns Message
   */
  const playlistFollowDelete = async (id: string): Promise<any> => {
    return await fetchData(`playlists/${id}/followers`, {
      method: RequestMethod.Delete,
    });
  };

  /**
   * PUT Add the current user as a follower of a playlist.
   * @param data Playlist id and follow put body
   * @returns Message
   */
  const playlistFollowPut = async (data: {
    id: string;
    body?: PlaylistFollowPutRequest;
  }): Promise<any> => {
    return await fetchData(`playlists/${data.id}/followers`, {
      body: data.body,
      method: RequestMethod.Put,
    });
  };

  /**
   * GET Playlist tracks by offset.
   * @param id Playlist id
   * @param params PlaylistsGetParams
   * @returns User playlists
   */
  const playlistTracksGet = async (data: {
    id: string;
    params?: PlaylistsGetParams;
  }): Promise<TracksGetResponse | undefined> => {
    return await fetchData(
      `playlists/${data.id}/tracks`,
      data.params && {
        params: new URLSearchParams({
          limit: data.params.limit.toString(),
          offset: data.params.offset.toString(),
        }),
      }
    );
  };

  /**
   * POST Add tracks to playlist
   * @param data PlaylistTracksAddPostRequest
   * @returns Message
   */
  const playlistTracksPost = async (
    data: PlaylistTracksAddPostRequest
  ): Promise<string | undefined> => {
    return await fetchData(`playlists/${data.id}/tracks`, {
      body: {
        position: data.position,
        uris: data.uris,
      },
      method: RequestMethod.Post,
    });
  };

  /**
   * DELETE Remove one or more items from a user's playlist.
   * @param data Playlist id and PlaylistItemsRemoveDeleteRequest
   * @returns Message
   */
  const playlistTracksDelete = async (data: {
    id: string;
    body: PlaylistItemsRemoveDeleteRequest;
  }): Promise<any> => {
    return await fetchData(`playlists/${data.id}/tracks`, {
      body: data.body,
      method: RequestMethod.Delete,
    });
  };

  return {
    playlistsGet,
    playlistsAddMutation,
    playlistGet,
    playlistUpdate,
    playlistFollowGet,
    playlistFollowDelete,
    playlistFollowPut,
    playlistTracksGet,
    playlistTracksPost,
    playlistTracksPostMutation,
    playlistTracksDelete,
  };
};

export default usePlaylistHttp;
