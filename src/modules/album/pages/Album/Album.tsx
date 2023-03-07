import { memo, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Tooltip } from '@mui/material';

// Components
import AlbumCard from '../../components/AlbumCard/AlbumCard';
import AlbumTrack from '../../components/AlbumTrack/AlbumTrack';
import ImageFallback from '../../../../shared/components/ImageFallback/ImageFallback';

// Hooks
import useAlbum from '../../use-album.hook';
import useAlbumHttp from '../../use-album-http.hook';
import useArtistHttp from '../../../artist/use-artist-http.hook';
import useBreakpoints from '../../../../shared/hooks/use-breakpoints.hook';
import useFetch from '../../../../shared/hooks/use-fetch.hook';
import usePlayerHttp from '../../../../shared/hooks/use-player-http.hook';
import useShared from '../../../../shared/hooks/use-shared.hook';
import useUserHttp from '../../../user/use-user-http.hook';

// Styles
import styles from './Album.module.scss';

// Stores
import useSharedStore from '../../../../shared/stores/use-shared.store';
import useUserStore from '../../../user/use-user.store';

// Types
import { AlbumCard as IAlbumCard, AlbumWithDuration } from '../../album.types';
import { ImageFallbackType } from '../../../../shared/types/shared.types';
import { ButtonType } from '../../../../shared/types/ui.types';
import { SaveAlbumsPutDeleteRequest } from '../../../user/user.types';

// UI
import H2 from '../../../../shared/ui/H2/H2';
import H3 from '../../../../shared/ui/H3/H3';
import IconButton from '../../../../shared/ui/IconButton/IconButton';
import Link from '../../../../shared/ui/Link/Link';

// Utils
import { albumDataMap } from '../../album.utils';
import { setTitle } from '../../../../shared/utils/shared.utils';

const Album = () => {
  const { typeTranslationByTypeGet } = useAlbum();
  const { albumGet } = useAlbumHttp();
  const { albumsGet } = useArtistHttp();
  const { smDown } = useBreakpoints();
  const { handleError, handleRetry } = useFetch();
  const { id } = useParams();
  const { playPutMutation } = usePlayerHttp();
  const { durationByMillisecondsGet } = useShared();
  const { i18n, t } = useTranslation();
  const { savedAlbumsCheckGet, savedAlbumsDelete, saveAlbumsPut } =
    useUserHttp();

  // Shared store state
  const [setHeaderTitle, setNotification] = useSharedStore((state) => [
    state.setHeaderTitle,
    state.setNotification,
  ]);

  // User store state
  const [profile] = useUserStore((state) => [state.profile]);

  // Component state
  const [album, setAlbum] = useState<AlbumWithDuration | undefined>(undefined);
  const [savedAlbum, setSavedAlbum] = useState<boolean>(false);
  const [otherAlbums, setOtherAlbums] = useState<IAlbumCard[]>([]);

  // ####### //
  // QUERIES //
  // ####### //

  // Get playlist on component mount.
  // eslint-disable-next-line
  const albumQuery = useQuery(['album', id], () => albumGet(id), {
    refetchOnWindowFocus: false,
    onError: (error: any) => {
      const errRes = error?.response;
      if (errRes) {
        console.error('Error on getting album:', error);
        handleError(errRes.status);
      }
    },
    onSuccess: (data) => {
      if (data) {
        // Calculate album duration by tracks duration
        if (data.tracks) {
          let albumDuration: number = 0;
          for (const track of data?.tracks.items) {
            albumDuration = albumDuration + track.duration_ms;
          }
          const album: AlbumWithDuration = {
            ...data,
            duration_ms: albumDuration,
          };
          setAlbum(album);
        }
        setTitle(data.name);
        // Wait for transition animation
        setTimeout(() => {
          setHeaderTitle(data.name);
        }, 500);
      }
    },
    retry: (failureCount, error: any) => handleRetry(failureCount, error),
  });

  // Get artist albums by id and user country.
  // eslint-disable-next-line
  const artistAlbumsQuery = useQuery(
    ['albums', album?.artists[0].id, profile?.country],
    () => albumsGet(album?.artists[0].id, profile?.country),
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
          setOtherAlbums(albumDataMap(data.items));
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Get saved album state by id.
  // eslint-disable-next-line
  const savedAlbumQuery = useQuery(
    ['following', id],
    () => savedAlbumsCheckGet(id ? { ids: [id] } : { ids: [] }),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting saved album states:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        data && setSavedAlbum(data[0]);
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // ######### //
  // MUTATIONS //
  // ######### //

  // GET Saved album delete mutation
  const savedAlbumDeleteMutation = useMutation(
    (params: SaveAlbumsPutDeleteRequest) => savedAlbumsDelete(params),
    {
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        setSavedAlbum(false);
        setNotification({
          title: `${album?.name} ${t('app.save.delete.success')}`,
        });
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // GET Save album put mutation
  const saveAlbumPutMutation = useMutation(
    (params: SaveAlbumsPutDeleteRequest) => saveAlbumsPut(params),
    {
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        setSavedAlbum(true);
        setNotification({
          title: `${album?.name} ${t('app.save.put.success')}`,
        });
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // ####### //
  // EFFECTS //
  // ####### //

  // Reset data on id change.
  useEffect(() => {
    return () => {
      setAlbum(undefined);
      setHeaderTitle(undefined);
      setTitle();
    };
    // eslint-disable-next-line
  }, [id]);

  // ######### //
  // CALLBACKS //
  // ######### //

  /**
   * Handler to play album (starting from custom selection).
   * @param contextUri Spotify URI of the context to play
   * @param trackUri TrackUri
   */
  const onPlayContext = useCallback(
    (contextUri: string, trackUri?: string) => {
      playPutMutation.mutate({
        body: {
          context_uri: contextUri,
          offset: trackUri ? { uri: trackUri } : undefined,
        },
      });
    },
    // eslint-disable-next-line
    []
  );

  /**
   * Handler to change saved album state.
   */
  const onSavedAlbumStateChange = useCallback(() => {
    if (id) {
      if (savedAlbum) {
        savedAlbumDeleteMutation.mutate({ ids: [id] });
      } else {
        saveAlbumPutMutation.mutate({ ids: [id] });
      }
    }
    // eslint-disable-next-line
  }, [savedAlbum, id]);

  return (
    <>
      {!album && albumQuery.isLoading && <CircularProgress />}
      {album && (
        <Box
          className={styles['album']}
          sx={{
            '.app-link:hover': {
              color: 'primary.main',
            },
          }}
        >
          <div className={styles['album-header']}>
            <div className={styles['album-header-image']}>
              {album.images[0]?.url ? (
                <img
                  alt={`${t('album.detail.title')} ${album.name}`}
                  src={album.images[0].url}
                />
              ) : (
                <ImageFallback type={ImageFallbackType.Album} />
              )}
            </div>
            <div className={styles['album-header-info']}>
              {!smDown && (
                <Box
                  className={styles['album-header-info-type']}
                  sx={{ color: 'text.secondary' }}
                >
                  {typeTranslationByTypeGet(album.album_type)}
                </Box>
              )}
              {smDown ? (
                <H3 classes={styles['album-header-title']}>{album.name}</H3>
              ) : (
                <H2>{album.name}</H2>
              )}
              <div className={styles['album-header-info-data']}>
                <div className={styles['album-header-info-data-section']}>
                  {album.artists.map((artist, index) => (
                    <div
                      key={artist.id}
                      className={styles['album-header-info-data-artist']}
                    >
                      <Link
                        key={artist.id}
                        classes={styles['album-header-info-data-artist-link']}
                        to={`/artist/${artist.id}`}
                      >{`${artist.name}`}</Link>
                      {`${index < album.artists.length - 1 ? ',\xa0' : ''}`}
                    </div>
                  ))}
                </div>
                <Box
                  className={styles['album-header-info-data-section']}
                  sx={{ color: 'text.secondary' }}
                >
                  {smDown && typeTranslationByTypeGet(album.album_type)}{' '}
                  <span className="whitespace-pre-wrap"> </span>
                  {' • '}
                  {new Intl.DateTimeFormat(i18n.language, {
                    year: 'numeric',
                  }).format(new Date(album.release_date))}
                </Box>
                <Box
                  className={styles['album-header-info-data-section']}
                  sx={{ color: 'text.secondary' }}
                >
                  {!smDown && (
                    <>
                      <span className="whitespace-pre-wrap"> </span>
                      {'• '}
                    </>
                  )}
                  {album.total_tracks} {`${t('track.title')}, `}
                  {durationByMillisecondsGet(album.duration_ms)}
                </Box>
              </div>
            </div>
          </div>
          <div className={styles['album-actions']}>
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
              onClick={() => onPlayContext(album.uri)}
            />
            <Tooltip
              placement="top"
              title={
                savedAlbum
                  ? t('app.save.delete.title')
                  : t('app.save.put.title')
              }
            >
              <IconButton
                classes={styles['album-actions-save']}
                color={savedAlbum ? 'primary' : 'inherit'}
                icon={[savedAlbum ? 'fas' : 'far', 'heart']}
                iconSize="medium"
                onClick={onSavedAlbumStateChange}
              />
            </Tooltip>
          </div>
          <div className={styles['album-content']}>
            {album.tracks.items.map((track, index) => (
              <AlbumTrack
                key={track.id}
                index={index}
                track={track}
                onPlay={() => onPlayContext(album.uri, track.uri)}
              />
            ))}
          </div>
          <Box
            className={styles['album-label']}
            sx={{ color: 'text.secondary' }}
          >
            <div className={styles['album-label-release']}>
              {new Intl.DateTimeFormat(i18n.language, {
                dateStyle: 'long',
              }).format(new Date(album.release_date))}
            </div>
            <div
              className={styles['album-label-copyright']}
            >{`© ${new Intl.DateTimeFormat(i18n.language, {
              year: 'numeric',
            }).format(new Date(album.release_date))} ${album.label}`}</div>
          </Box>
          <section className={styles['album-more-by']}>
            <H3>{`${t('album.detail.more_by')} ${album.artists[0].name}`}</H3>
            <div className="context-grid">
              {otherAlbums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </section>
        </Box>
      )}
    </>
  );
};

export default memo(Album);
