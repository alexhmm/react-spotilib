import { memo } from 'react';

// Hooks
import { useBreakpoints } from '../../../../shared/hooks/use-breakpoints.hook';

// Styles
import styles from './PlaylistTrack.module.scss';

// Types
import { Track } from '../../../tracks/tracks.types';

// Utils
import { minutesSecondsByMillisecondsGet } from '../../../../shared/utils/shared.utils';
import { useTranslation } from 'react-i18next';

type PlaylistTrackProps = {
  track: Track;
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
              <div
                key={artist.id}
                className={styles['playlist-track-title-info-artists-item']}
              >{`${artist.name}${
                index < props.track.track.artists.length - 1 ? ',\xa0' : ''
              }`}</div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles['playlist-track-album']}>
        {props.track.track.album.name}
      </div>
      <div className={styles['playlist-track-added-at']}>
        {new Intl.DateTimeFormat(i18n.language).format(
          new Date(props.track.added_at)
        )}
      </div>
      <div className={styles['playlist-track-duration']}>
        {minutesSecondsByMillisecondsGet(props.track.track.duration_ms)}
      </div>
    </div>
  );
};

export default memo(PlaylistTrack);
