import { memo, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@mui/material';

// Components
import PlaylistTrack from '../../components/PlaylistTrack/PlaylistTrack';

// Hooks
import { useFetch } from '../../../../shared/hooks/use-fetch.hook';
import { useObjectURL } from '../../../../shared/hooks/use-object-url.hook';
import { usePlayerHttp } from '../../../../shared/hooks/use-player-http.hook';
import { usePlaylist } from '../../use-playlist.hook';
import { usePlaylistHttp } from '../../use-playlist-http.hook';

// Styles
import styles from './Playlist.module.scss';

// Stores
import { useSharedStore } from '../../../../shared/stores/use-shared.store';

// Types
import {
  PlaylistsGetParams,
  Playlist as IPlaylist,
} from '../../playlist.types';

// UI
import H2 from '../../../../shared/ui/H2/H2';
import { IconButton } from '../../../../shared/ui/IconButton/IconButton';

// Utils
import { playlistCreate } from '../../playlist.utils';

const Playlist = () => {
  const { handleError, handleRetry } = useFetch();
  const { objectURL, setObject } = useObjectURL(null);
  const { id } = useParams();
  const { playPutMutation } = usePlayerHttp();
  const { playlistTracksGetEffect } = usePlaylist();
  const { playlistGet, playlistTracksGet } = usePlaylistHttp();
  const { i18n, t } = useTranslation();

  // Component state
  const [playlist, setPlaylist] = useState<IPlaylist | undefined>(undefined);

  // Shared store state
  const [setHeaderTitle] = useSharedStore((state) => [state.setHeaderTitle]);

  // ####### //
  // QUERIES //
  // ####### //

  // Get playlist on component mount.
  // eslint-disable-next-line
  const playlistQuery = useQuery(['playlist', id], () => playlistGet(id), {
    refetchOnWindowFocus: false,
    onError: (error: any) => {
      const errRes = error?.response;
      if (errRes) {
        console.error('Error on getting profile:', error);
        handleError(errRes.status);
      }
    },
    onSuccess: (data) => {
      if (data) {
        const mappedPlaylist = playlistCreate(data);
        setPlaylist(mappedPlaylist);
        const output = JSON.stringify({ playlist: mappedPlaylist }, null, 4);
        const blob = new Blob([output]);
        setObject(blob);
        // Wait for transition animation
        setTimeout(() => {
          setHeaderTitle(data?.name);
        }, 500);
      }
    },
  });

  // ######### //
  // MUTATIONS //
  // ######### //

  // GET Playlist tracks mutation
  const playlistTracksGetMutation = useMutation(
    (data: { id: string; params?: PlaylistsGetParams }) =>
      playlistTracksGet(data),
    {
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        data &&
          playlist &&
          setPlaylist(playlistTracksGetEffect(data.items, playlist));
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // ####### //
  // EFFECTS //
  // ####### //

  // Reset playlist on id change
  useEffect(() => {
    playlist && setPlaylist(undefined);
    // Reset header title
    return () => {
      setHeaderTitle(undefined);
    };
    // eslint-disable-next-line
  }, [id]);

  // ######### //
  // CALLBACKS //
  // ######### //

  /**
   * Handler to add tracks to playlist.
   */
  const onAddTracks = useCallback(() => {
    if (playlist?.id && playlist?.tracks.length < playlist?.tracks_total) {
      playlistTracksGetMutation.mutate({
        id: playlist.id,
        params: { limit: 100, offset: playlist.tracks.length },
      });
    }
    // eslint-disable-next-line
  }, [playlist]);

  /**
   * Handler to play track from playlist.
   */
  const onTrackPlay = useCallback((playlistUri: string, trackUri: string) => {
    playPutMutation.mutate({
      body: {
        context_uri: playlistUri,
        offset: { uri: trackUri },
      },
    });
    // eslint-disable-next-line
  }, []);

  /**
   * Handler to download playlist meta data.
   */
  const onPlaylistMetaDataDownload = useCallback(() => {
    const output = JSON.stringify({ playlist: playlist }, null, 4);
    // Create file data
    const blob = new Blob([output]);
    setObject(blob);
    // eslint-disable-next-line
  }, [playlist]);

  return (
    <>
      {!playlist && playlistQuery.isLoading && <CircularProgress />}
      {playlist && (
        <InfiniteScroll
          className={styles['playlist']}
          dataLength={playlist?.tracks.length}
          hasMore={true}
          loader={null}
          next={onAddTracks}
          scrollThreshold={1}
        >
          <div className={styles['playlist-header']}>
            <div className={styles['playlist-header-img']}>
              <img
                alt={`${t('playlist.detail.title')} ${playlist.name}`}
                src={playlist.images[0].url}
                onClick={onPlaylistMetaDataDownload}
              />
            </div>
            <div className={styles['playlist-header-info']}>
              <div className={styles['playlist-header-info-meta']}>
                <div className={styles['playlist-header-info-meta-type']}>
                  {t('playlist.detail.title')}
                </div>
                <div className={styles['playlist-header-info-meta-public']}>
                  {playlist.public
                    ? t('playlist.detail.public.true')
                    : t('playlist.detail.public.false')}
                </div>
              </div>
              <H2>{playlist.name}</H2>
              <div className={styles['playlist-header-info-description']}>
                {playlist.description}
              </div>
              <div className={styles['playlist-header-info-tracks']}>
                {playlist.owner.display_name} • {playlist.tracks_total}{' '}
                {t('playlist.detail.tracks')}
                {objectURL && (
                  <a
                    className="app-link"
                    download={`${playlist.name}.json`}
                    href={objectURL}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <IconButton icon={['fas', 'download']} />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className={styles['playlist-content']}>
            {playlist.tracks.map((track) => (
              <PlaylistTrack
                key={track.id}
                locale={i18n.language}
                track={track}
                onPlay={() => onTrackPlay(playlist.uri, track.uri)}
              />
            ))}
            {playlistTracksGetMutation.isLoading && <CircularProgress />}
          </div>
        </InfiniteScroll>
      )}
    </>
  );
};

export default memo(Playlist);
