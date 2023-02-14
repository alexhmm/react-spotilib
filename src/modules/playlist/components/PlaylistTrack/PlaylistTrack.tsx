import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Styles
import styles from './PlaylistTrack.module.scss';

// Types
import { PlaylistTrack as IPlaylistTrack } from '../../playlist.types';

// UI
import IconButton from '../../../../shared/ui/IconButton/IconButton';

// Utils
import { minutesSecondsByMillisecondsGet } from '../../../../shared/utils/shared.utils';

type PlaylistTrackProps = {
  locale: string;
  track: IPlaylistTrack;
  onPlay: () => void;
};

const playlistPropsAreEqual = (
  prevProps: Readonly<PlaylistTrackProps>,
  nextProps: Readonly<PlaylistTrackProps>
): boolean => {
  if (
    prevProps.locale === nextProps.locale &&
    prevProps.track.id === nextProps.track.id
  ) {
    return true;
  }
  return false;
};

const PlaylistTrack = (props: PlaylistTrackProps) => {
  return (
    <Box
      className={styles['playlist-track']}
      sx={{
        ':hover': {
          backgroundColor: 'action.hover',
          '.image': {
            display: 'none',
          },
          '.play': {
            display: 'flex !important',
          },
        },
        '.app-link:hover': {
          color: 'primary.main',
        },
        '.play': {
          display: 'none !important',
        },
      }}
    >
      <div className={styles['playlist-track-title']}>
        <img
          alt={props.track.album.name}
          className={clsx(styles['playlist-track-title-image'], 'image')}
          height={36}
          src={props.track.album.images[2].url}
          width={36}
          loading="lazy"
        />
        <IconButton
          classes={clsx(styles['playlist-track-title-play'], 'play')}
          icon={['fas', 'play']}
          onClick={props.onPlay}
        />
        <Box className={styles['playlist-track-title-data']}>
          <div className={styles['playlist-track-title-data-name']}>
            {props.track.name}
          </div>
          <div className={styles['playlist-track-title-data-artists']}>
            {props.track.artists.map((artist, index) => (
              <Box
                key={artist.id}
                className={styles['playlist-track-title-data-artists-item']}
                sx={{ color: 'text.secondary' }}
              >
                <Link
                  key={artist.id}
                  className={clsx(
                    styles['playlist-track-title-data-artists-item-link'],
                    'app-link'
                  )}
                  to={`/artist/${artist.id}`}
                >{`${artist.name}`}</Link>
                {`${index < props.track.artists.length - 1 ? ',\xa0' : ''}`}
              </Box>
            ))}
          </div>
        </Box>
      </div>
      <Box
        className={styles['playlist-track-album']}
        sx={{ color: 'text.secondary' }}
      >
        <Link className="app-link" to={`/album/${props.track.album.id}`}>
          {props.track.album.name}
        </Link>
      </Box>
      <Box
        className={styles['playlist-track-added-at']}
        sx={{ color: 'text.secondary' }}
      >
        {new Intl.DateTimeFormat(props.locale).format(
          new Date(props.track.added_at)
        )}
      </Box>
      <Box
        className={styles['playlist-track-duration']}
        sx={{ color: 'text.secondary' }}
      >
        {minutesSecondsByMillisecondsGet(props.track.duration_ms)}
      </Box>
    </Box>
  );
};

export default memo(PlaylistTrack, playlistPropsAreEqual);
