import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@mui/material';

// Components
import PlaylistTrack from '../../components/PlaylistTrack/PlaylistTrack';

// Hooks
import { usePlaylistsHttp } from '../../use-playlists-http.hook';

// Styles
import styles from './Playlist.module.scss';

// Types
import { Playlist as IPlaylist } from '../../playlists.types';

// UI
import H2 from '../../../../shared/ui/H2/H2';

const Playlist = () => {
  const { id } = useParams();
  const { playlistGet } = usePlaylistsHttp();
  const { t } = useTranslation();

  // Component state
  const [playlist, setPlaylist] = useState<IPlaylist | undefined>(undefined);

  // ####### //
  // QUERIES //
  // ####### //

  // Get playlist on component mount.
  // eslint-disable-next-line
  const playlistQuery = useQuery(['playlist', id], () => playlistGet(id), {
    refetchOnWindowFocus: false,
    onError: (error: unknown) => {
      console.error('Error on getting profile:', error);
    },
    onSuccess: (data) => {
      console.log('playlistQuery success', data);
      setPlaylist(data);
    },
  });

  // ####### //
  // EFFECTS //
  // ####### //

  // Reset playlist on id change
  useEffect(() => {
    playlist && setPlaylist(undefined);
    // eslint-disable-next-line
  }, [id]);

  return (
    <div className={styles['playlist']}>
      {!playlist && playlistQuery.isLoading && <CircularProgress />}
      {playlist && (
        <>
          <div className={styles['playlist-header']}>
            <div className={styles['playlist-header-img']}>
              <img
                alt={`${t('playlists.detail.title')} ${playlist.name}`}
                src={playlist.images[0].url}
              />
            </div>
            <div className={styles['playlist-header-info']}>
              <div className={styles['playlist-header-info-meta']}>
                <div className={styles['playlist-header-info-meta-type']}>
                  {t('playlists.detail.title')}
                </div>
                <div className={styles['playlist-header-info-meta-public']}>
                  {playlist.public
                    ? t('playlists.detail.public.true')
                    : t('playlists.detail.public.false')}
                </div>
              </div>
              <H2>{playlist.name}</H2>
              <div className={styles['playlist-header-info-description']}>
                {playlist.description}
              </div>
              <div className={styles['playlist-header-info-tracks']}>
                {playlist.owner.display_name} • {playlist.tracks.total}{' '}
                {t('playlists.detail.tracks')}
              </div>
            </div>
          </div>
          <div className={styles['playlist-content']}>
            {playlist.tracks.items.map((track) => (
              <PlaylistTrack key={track.track.id} track={track} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(Playlist);
