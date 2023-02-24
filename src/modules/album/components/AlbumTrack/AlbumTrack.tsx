import { memo } from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Hooks
import useBreakpoints from '../../../../shared/hooks/use-breakpoints.hook';

// Styles
import styles from './AlbumTrack.module.scss';

// Types
import { AlbumTrack as IAlbumTrack } from '../../album.types';

// UI
import IconButton from '../../../../shared/ui/IconButton/IconButton';

// Utils
import { minutesSecondsByMillisecondsGet } from '../../../../shared/utils/shared.utils';

type PlaylistTrackProps = {
  index: number;
  track: IAlbumTrack;
  onPlay: () => void;
};

const albumPropsAreEqual = (
  prevProps: Readonly<PlaylistTrackProps>,
  nextProps: Readonly<PlaylistTrackProps>
): boolean => {
  if (prevProps.track.id === nextProps.track.id) {
    return true;
  }
  return false;
};

const AlbumTrack = (props: PlaylistTrackProps) => {
  const { smDown } = useBreakpoints();

  return (
    <Box
      className={styles['album-track']}
      sx={{
        '@media (hover: hover)': {
          ':hover': {
            backgroundColor: 'action.hover',
            '.index': {
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
        },
      }}
      onClick={() => isMobile && props.onPlay()}
    >
      <div className={styles['album-track-title']}>
        <Box
          className={clsx(styles['album-track-title-index'], 'index')}
          sx={{ color: 'text.secondary' }}
        >
          {props.index + 1}
        </Box>
        {!isMobile && !smDown && (
          <IconButton
            classes={clsx(styles['album-track-title-play'], 'play')}
            icon={['fas', 'play']}
            onClick={props.onPlay}
          />
        )}
        <Box className={styles['album-track-title-data']}>
          <div className={styles['album-track-title-data-name']}>
            {props.track.name}
          </div>
          <div className={styles['album-track-title-data-artists']}>
            {props.track.artists.map((artist, index) => (
              <Box
                key={artist.id}
                className={styles['album-track-title-data-artists-item']}
                sx={{ color: 'text.secondary' }}
              >
                {isMobile ? (
                  <>{artist.name}</>
                ) : (
                  <Link
                    key={artist.id}
                    className={clsx(
                      styles['album-track-title-data-artists-item-link'],
                      'app-link'
                    )}
                    to={`/artist/${artist.id}`}
                  >
                    {artist.name}
                  </Link>
                )}
                {`${index < props.track.artists.length - 1 ? ',\xa0' : ''}`}
              </Box>
            ))}
          </div>
        </Box>
      </div>
      <Box
        className={styles['album-track-duration']}
        sx={{ color: 'text.secondary' }}
      >
        {minutesSecondsByMillisecondsGet(props.track.duration_ms)}
      </Box>
    </Box>
  );
};

export default memo(AlbumTrack, albumPropsAreEqual);
