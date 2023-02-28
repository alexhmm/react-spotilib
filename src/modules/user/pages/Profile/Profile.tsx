import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Box } from '@mui/material';

// Components
import PlaylistCard from '../../../playlist/components/PlaylistCard/PlaylistCard';

// Hooks
import useBreakpoints from '../../../../shared/hooks/use-breakpoints.hook';
import useFetch from '../../../../shared/hooks/use-fetch.hook';
import usePlaylistHttp from '../../../playlist/use-playlist-http.hook';
import useUserHttp from '../../use-user-http.hook';

// Stores
import useSharedStore from '../../../../shared/stores/use-shared.store';
import useUserStore from '../../use-user.store';

// Styles
import styles from './Profile.module.scss';

// Types
import { PlaylistCard as IPlaylistCard } from '../../../playlist/playlist.types';
import {
  ImageFallbackType,
  RequestMethod,
} from '../../../../shared/types/shared.types';
import { SpotifyFollowType } from '../../../../shared/types/spotify.types';
import { ButtonType } from '../../../../shared/types/ui.types';
import { UserProfile } from '../../user.types';

// Utils
import { playlistDataMap } from '../../../playlist/playlist.utils';

// UI
import H3 from '../../../../shared/ui/H3/H3';
import H2 from '../../../../shared/ui/H2/H2';
import TextButtonOutlined from '../../../../shared/ui/TextButtonOutlined/TextButtonOutlined';
import ImageFallback from '../../../../shared/components/ImageFallback/ImageFallback';

const Profile = () => {
  const { mdDown } = useBreakpoints();
  const { handleError, handleRetry } = useFetch();
  const { id } = useParams();
  const { playlistsGet } = usePlaylistHttp();
  const { followingStateGet, followingStatePutDeleteMutation, profileGet } =
    useUserHttp();
  const { t } = useTranslation();

  // Shared store state
  const [followingState, setFollowingState] = useSharedStore((state) => [
    state.following,
    state.setFollowing,
  ]);

  // User store state
  const [profile] = useUserStore((state) => [state.profile]);

  // Component state
  const [playlists, setPlaylists] = useState<IPlaylistCard[]>([]);
  const [playlistsTotal, setPlaylistsTotal] = useState<number | undefined>(
    undefined
  );
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(
    undefined
  );

  // ####### //
  // QUERIES //
  // ####### //

  // Get user following state by id.
  // eslint-disable-next-line
  const followingStateQuery = useQuery(
    ['following', id],
    () =>
      followingStateGet({
        ids: [id ?? ''],
        type: SpotifyFollowType.User,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting following state for user:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        data && setFollowingState(data[0]);
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Get user playlists by id
  // eslint-disable-next-line
  const playlistsQuery = useQuery(
    ['playlists', id],
    () => playlistsGet(id ?? ''),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting user playlists:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        if (data) {
          setPlaylists(playlistDataMap(data.items));
          setPlaylistsTotal(data.total);
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Get user profile by id.
  // eslint-disable-next-line
  const profileQuery = useQuery(['profile', id], () => profileGet(id ?? ''), {
    refetchOnWindowFocus: false,
    onError: (error: any) => {
      const errRes = error?.response;
      if (errRes) {
        console.error('Error on getting user profile:', error);
        handleError(errRes.status);
      }
    },
    onSuccess: (data) => {
      data && setUserProfile(data);
    },
    retry: (failureCount, error: any) => handleRetry(failureCount, error),
  });

  // ######### //
  // CALLBACKS //
  // ######### //

  /**
   * Handler to change following state.
   */
  const onFollowStateChange = useCallback(() => {
    id &&
      followingStatePutDeleteMutation.mutate({
        body: {
          ids: [id],
        },
        deleteSuccessMessage: t('user.profile.follow.delete'),
        method: followingState ? RequestMethod.Delete : RequestMethod.Put,
        params: {
          ids: [id],
          type: SpotifyFollowType.User,
        },
        putSuccessMessage: t('user.profile.follow.put'),
      });
    // eslint-disable-next-line
  }, [followingState, id]);

  // ####### //
  // EFFECTS //
  // ####### //

  // Reset following state on component unmount.
  useEffect(() => {
    return () => {
      setFollowingState(undefined);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      className={styles['profile']}
      sx={{
        '.app-link:hover': {
          color: 'primary.main',
        },
      }}
    >
      {userProfile && (
        <section className={styles['profile-header']}>
          <div className={styles['profile-header-image']}>
            {userProfile.images[0]?.url ? (
              <img
                alt={`${t('user.profile.title')} ${userProfile.display_name}`}
                src={userProfile.images[0].url}
              />
            ) : (
              <ImageFallback type={ImageFallbackType.Profile} />
            )}
          </div>
          <div className={styles['profile-header-info']}>
            {!mdDown && (
              <Box
                className={styles['profile-header-info-title']}
                sx={{ color: 'text.secondary' }}
              >
                {t('user.profile.title')}
              </Box>
            )}
            {mdDown ? (
              <H3>{userProfile.display_name}</H3>
            ) : (
              <H2>{userProfile.display_name}</H2>
            )}
            <div className={styles['profile-header-info-data']}>
              {playlistsTotal && (
                <Box
                  className={styles['profile-header-info-data-section']}
                  sx={{ color: 'text.secondary' }}
                >
                  {playlistsTotal}{' '}
                  {profile?.id === id
                    ? t('user.profile.playlists.title.all')
                    : t('user.profile.playlists.title.public')}
                </Box>
              )}
              {userProfile && (
                <Box
                  className={styles['profile-header-info-data-section']}
                  sx={{ color: 'text.secondary' }}
                >
                  {!mdDown && (
                    <>
                      <span className="whitespace-pre-wrap"> </span>
                      {'• '}
                    </>
                  )}
                  {userProfile.followers.total} {t('app.followers')}
                </Box>
              )}
            </div>
          </div>
        </section>
      )}
      <section className={styles['profile-actions']}>
        {followingState !== undefined && profile?.id !== userProfile?.id && (
          <TextButtonOutlined
            preset={followingState ? ButtonType.Selected : undefined}
            onClick={onFollowStateChange}
          >
            {followingState ? t('app.follow.active') : t('app.follow.inactive')}
          </TextButtonOutlined>
        )}
      </section>
      <section className={styles['profile-section']}>
        <H3
          actionTitle={t('app.show.all').toString()}
          onAction={() => console.log('Show all playlists')}
        >
          {profile?.id === id
            ? t('user.profile.playlists.title.all')
            : t('user.profile.playlists.title.public')}
        </H3>
        <div className="context-grid">
          {playlists &&
            playlists.length > 0 &&
            playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} hideOwner playlist={playlist} />
            ))}
        </div>
      </section>
    </Box>
  );
};

export default Profile;
