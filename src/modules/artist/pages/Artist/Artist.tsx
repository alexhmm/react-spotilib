import { memo, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { CircularProgress } from '@mui/material';

// Components
import AlbumCard from '../../../album/components/AlbumCard/AlbumCard';
import ArtistCard from '../../components/ArtistCard/ArtistCard';
import ArtistTopTrack from '../../components/ArtistTopTrack/ArtistTopTrack';

// Hooks
import useArtistHttp from '../../use-artist-http.hook';
import useFetch from '../../../../shared/hooks/use-fetch.hook';
import usePlayerHttp from '../../../../shared/hooks/use-player-http.hook';

// Stores
import useSharedStore from '../../../../shared/stores/use-shared.store';
import useUserStore from '../../../user/use-user.store';

// Styles
import styles from './Artist.module.scss';

// Types
import { AlbumCard as IAlbumCard } from '../../../album/album.types';
import {
  ArtistCard as IArtistCard,
  ArtistTopTracksGetResponse,
} from '../../artist.types';
import {
  SpotifyAlbumType,
  SpotifyArtist,
  SpotifyFollowType,
  SpotifyTrack,
} from '../../../../shared/types/spotify.types';
import { ButtonType } from '../../../../shared/types/ui.types';

// UI
import H2 from '../../../../shared/ui/H2/H2';
import H3 from '../../../../shared/ui/H3/H3';
import IconButton from '../../../../shared/ui/IconButton/IconButton';
import TextButton from '../../../../shared/ui/TextButton/TextButton';
import TextButtonContained from '../../../../shared/ui/TextButtonContained/TextButtonContained';
import TextButtonOutlined from '../../../../shared/ui/TextButtonOutlined/TextButtonOutlined';

// Utils
import { albumDataMap } from '../../../album/album.utils';
import { artistDataMap } from '../../artist.utils';
import useUserHttp from '../../../user/use-user-http.hook';
import {
  FollowingStateGetRequest,
  FollowingStatePutDeleteRequest,
} from '../../../user/user.types';
import { RequestMethod } from '../../../../shared/types/shared.types';

type ArtistAlbumsTypeButtonProps = {
  currentType: SpotifyAlbumType | undefined;
  type?: SpotifyAlbumType;
  title: string;
  onClick: (type: SpotifyAlbumType | undefined) => void;
};

const ArtistAlbumsTypeButton = (props: ArtistAlbumsTypeButtonProps) => {
  return (
    <TextButtonContained
      classes={styles['artist-discography-types-button']}
      preset={
        props.currentType === props.type ? ButtonType.Selected : undefined
      }
      onClick={() => props.onClick(props.type)}
    >
      {props.title}
    </TextButtonContained>
  );
};

const Artist = () => {
  const { albumsGet, artistGet, relatedArtistsGet, topTracksGet } =
    useArtistHttp();
  const { handleError, handleRetry } = useFetch();
  const { id } = useParams();
  const { playPutMutation } = usePlayerHttp();
  const { t, i18n } = useTranslation();
  const { followingStateGet, followingStatePutDelete } = useUserHttp();

  // Shared store state
  const [setHeaderTitle, setNotification] = useSharedStore((state) => [
    state.setHeaderTitle,
    state.setNotification,
  ]);

  // User store state
  const [profile] = useUserStore((state) => [state.profile]);

  // Component state
  const [albums, setAlbums] = useState<IAlbumCard[]>([]);
  const [albumsType, setAlbumsType] = useState<SpotifyAlbumType | undefined>(
    undefined
  );
  const [appearsOn, setAppearsOn] = useState<IAlbumCard[]>([]);
  const [artist, setArtist] = useState<SpotifyArtist | undefined>(undefined);
  const [followingState, setFollingState] = useState<boolean | undefined>(
    undefined
  );
  const [relatedArtists, setRelatedArtists] = useState<IArtistCard[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topTracksMore, setTopTracksMore] = useState<boolean>(false);

  // ####### //
  // QUERIES //
  // ####### //

  // Get artist albums by id, user country and album type.
  // eslint-disable-next-line
  const albumsQuery = useQuery(
    ['albums', id, profile?.country, albumsType],
    () => albumsGet(id, profile?.country, albumsType),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting artist albums:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        if (data) {
          setAlbums(albumDataMap(data.items));
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Get artist appears on by id, user country.
  // eslint-disable-next-line
  const appearsOnQuery = useQuery(
    ['appears-on', id, profile?.country],
    () => albumsGet(id, profile?.country, SpotifyAlbumType.AppearsOn),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting artist appears on:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        if (data) {
          setAppearsOn(albumDataMap(data.items));
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Get artist by id.
  // eslint-disable-next-line
  const artistQuery = useQuery(['artist', id], () => artistGet(id), {
    refetchOnWindowFocus: false,
    onError: (error: any) => {
      const errRes = error?.response;
      if (errRes) {
        console.error('Error on getting artist:', error);
        handleError(errRes.status);
      }
    },
    onSuccess: (data) => {
      if (data) {
        setArtist(data);
        // Wait for transition animation
        setTimeout(() => {
          setHeaderTitle(data?.name);
        }, 500);
      }
    },
    retry: (failureCount, error: any) => handleRetry(failureCount, error),
  });

  // Get artist follow state by id.
  // eslint-disable-next-line
  const followingStateQuery = useQuery(
    ['following', id],
    () =>
      followingStateGet({
        ids: [id ?? ''],
        type: SpotifyFollowType.Artist,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting following state for artist:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        if (data) {
          setFollingState(data[0]);
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Get related artists by artist id.
  // eslint-disable-next-line
  const relatedArtistsQuery = useQuery(
    ['related-artists', id],
    () => relatedArtistsGet(id),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting related artists:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        if (data) {
          setRelatedArtists(artistDataMap(data.artists));
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Get artist top tracks by id and user country.
  // eslint-disable-next-line
  const topTracksQuery = useQuery(
    ['top-tracks', id, profile?.country],
    () => topTracksGet(id, profile?.country),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting artists top tracks:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data: ArtistTopTracksGetResponse) => {
        if (data) {
          setTopTracks(data.tracks);
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // ######### //
  // MUTATIONS //
  // ######### //

  // PUT / DELETE Following state mutation
  const followingStatePutDeleteMutation = useMutation(
    (data: {
      body: FollowingStatePutDeleteRequest;
      method: RequestMethod;
      params: FollowingStateGetRequest;
    }) => followingStatePutDelete(data),
    {
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          handleError(errRes.status);
        }
      },
      onSuccess: (data, variables) => {
        setFollingState(variables.method === RequestMethod.Put ? true : false);
        setNotification({
          title:
            variables.method === RequestMethod.Put
              ? 'Zu Künstli hinzugefügt'
              : 'Aus Künstli entfernt',
        });
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

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
        method: followingState ? RequestMethod.Delete : RequestMethod.Put,
        params: {
          ids: [id],
          type: SpotifyFollowType.Artist,
        },
      });
    // eslint-disable-next-line
  }, [followingState, id]);

  /**
   * Handler to play context by uri.
   * @param contextUri Spotify URI of the context to play
   *
   */
  const onPlayContext = useCallback(
    (contextUri: string) => {
      playPutMutation.mutate({
        body: {
          context_uri: contextUri,
        },
      });
    },
    // eslint-disable-next-line
    []
  );

  /**
   * Handler to play top track from artist starting from selected index.
   */
  const onPlayTopTrack = useCallback(
    (index: number) => {
      const uris: string[] = [];
      for (let i = index; i < topTracks.length; i++) {
        uris.push(topTracks[i].uri);
      }
      playPutMutation.mutate({
        body: {
          uris,
        },
      });
    },
    // eslint-disable-next-line
    [topTracks]
  );

  return (
    <>
      {!artist && artistQuery.isLoading && <CircularProgress />}
      {artist && (
        <div className={styles['artist']}>
          <div className={styles['artist-header']}>
            <div className={styles['artist-header-image']}>
              <img
                alt={`${t('artist.title')} ${artist.name}`}
                src={artist.images[0].url}
              />
            </div>
            <div className={styles['artist-header-info']}>
              <H2 classes={styles['artist-header-info-name']}>{artist.name}</H2>
              <div className={styles['artist-header-info-followers']}>
                {new Intl.NumberFormat(i18n.language).format(
                  artist.followers.total
                )}
                {' ' + t('artist.detail.followers')}
              </div>
            </div>
          </div>
          <div className={styles['artist-actions']}>
            <IconButton
              borderRadius="rounded-full"
              icon={['fas', 'play']}
              iconSize="medium"
              padding="1rem"
              preset={ButtonType.Primary}
              sx={{
                svg: {
                  transform: 'translateX(2px)',
                },
              }}
              onClick={() => onPlayContext(artist.uri)}
            />
            {followingState !== undefined && (
              <TextButtonOutlined
                classes={styles['artist-actions-follow']}
                onClick={onFollowStateChange}
              >
                {followingState
                  ? t('artist.detail.follow.active')
                  : t('artist.detail.follow.inactive')}
              </TextButtonOutlined>
            )}
          </div>
          <section className={styles['artist-section']}>
            <H3>{t('artist.detail.top_tracks')}</H3>
            {topTracks &&
              topTracks.map((track, index) => {
                if ((!topTracksMore && index < 5) || topTracksMore) {
                  return (
                    <ArtistTopTrack
                      key={track.id}
                      track={track}
                      onPlay={() => onPlayTopTrack(index)}
                    />
                  );
                }
                return null;
              })}
            <TextButton
              onClick={() =>
                topTracksMore ? setTopTracksMore(false) : setTopTracksMore(true)
              }
            >
              {topTracksMore ? t('app.show.less') : t('app.show.more')}
            </TextButton>
          </section>
          <section className={styles['artist-section']}>
            <H3>{t('artist.detail.discography.title')}</H3>
            <div className={styles['artist-discography-types']}>
              <ArtistAlbumsTypeButton
                currentType={albumsType}
                title={t('artist.detail.discography.type.all')}
                onClick={() => setAlbumsType(undefined)}
              />
              <ArtistAlbumsTypeButton
                currentType={albumsType}
                title={t('artist.detail.discography.type.album')}
                type={SpotifyAlbumType.Album}
                onClick={() => setAlbumsType(SpotifyAlbumType.Album)}
              />
              <ArtistAlbumsTypeButton
                currentType={albumsType}
                title={t('artist.detail.discography.type.single')}
                type={SpotifyAlbumType.Single}
                onClick={() => setAlbumsType(SpotifyAlbumType.Single)}
              />
              <ArtistAlbumsTypeButton
                currentType={albumsType}
                title={t('artist.detail.discography.type.compilation')}
                type={SpotifyAlbumType.Compilation}
                onClick={() => setAlbumsType(SpotifyAlbumType.Compilation)}
              />
            </div>
            <div className="context-grid">
              {albums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onPlay={() => onPlayContext(album.uri)}
                />
              ))}
            </div>
          </section>
          <section className={styles['artist-section']}>
            <H3>{t('artist.detail.related_artists')}</H3>
            <div className="context-grid">
              {relatedArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </section>
          <section className={styles['artist-section']}>
            <H3>{t('artist.detail.appears_on')}</H3>
            <div className="context-grid">
              {appearsOn.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onPlay={() => onPlayContext(album.uri)}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default memo(Artist);
