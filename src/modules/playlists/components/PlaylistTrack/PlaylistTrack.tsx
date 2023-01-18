import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

// Hooks
import { useBreakpoints } from '../../../../shared/hooks/use-breakpoints.hook';

// Styles
import styles from './PlaylistTrack.module.scss';

// Types
import { TrackMetaData } from '../../../tracks/tracks.types';

// Utils
import { minutesSecondsByMillisecondsGet } from '../../../../shared/utils/shared.utils';

type PlaylistTrackProps = {
  track: TrackMetaData;
};

const PlaylistTrack = (props: PlaylistTrackProps) => {
  const { lgDown } = useBreakpoints();
  const { i18n } = useTranslation();

  return (
    <div className={styles['playlist-track']}>
      <div className={styles['playlist-track-title']}>
        <div className={styles['playlist-track-title-image']}>
          <img
            alt={props.track.track.album.name}
            height={lgDown ? 32 : 40}
            src={props.track.track.album.images[2].url}
            width={lgDown ? 32 : 40}
            loading="lazy"
          />
        </div>
        <div className={styles['playlist-track-title-info']}>
          <div className={styles['playlist-track-title-info-name']}>
            {props.track.track.name}
          </div>
          <div className={styles['playlist-track-title-info-artists']}>
            {props.track.track.artists.map((artist, index) => (
              <Box
                key={artist.id}
                className={styles['playlist-track-title-info-artists-item']}
                sx={{ color: 'text.secondary' }}
              >{`${artist.name}${
                index < props.track.track.artists.length - 1 ? ',\xa0' : ''
              }`}</Box>
            ))}
          </div>
        </div>
      </div>
      <Box
        className={styles['playlist-track-album']}
        sx={{ color: 'text.secondary' }}
      >
        {props.track.track.album.name}
      </Box>
      <Box
        className={styles['playlist-track-added-at']}
        sx={{ color: 'text.secondary' }}
      >
        {new Intl.DateTimeFormat(i18n.language).format(
          new Date(props.track.added_at)
        )}
      </Box>
      <Box
        className={styles['playlist-track-duration']}
        sx={{ color: 'text.secondary' }}
      >
        {minutesSecondsByMillisecondsGet(props.track.track.duration_ms)}
      </Box>
    </div>
  );
};

export default memo(PlaylistTrack);
