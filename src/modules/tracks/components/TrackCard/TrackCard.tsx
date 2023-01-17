import { memo } from 'react';
import { Box } from '@mui/material';

// Styles
import styles from './TrackCard.module.scss';

// Types
import { TrackDetail } from '../../tracks.types';

type TrackCardProps = {
  track: TrackDetail;
};

const ArtistCard = (props: TrackCardProps) => {
  return (
    <Box
      className={styles['track-card']}
      sx={{ backgroundColor: 'background.paper' }}
    >
      <img
        alt={props.track.album.name}
        className={styles['track-card-image']}
        src={props.track.album.images[2].url}
      />
      <div className={styles['track-card-info']}>
        <div className={styles['track-card-info-track']}>
          {props.track.name}
        </div>
        <div className={styles['track-card-info-artists']}>
          {props.track.artists.map((artist, index) => (
            <div
              key={artist.id}
              className={styles['track-card-info-artists-item']}
            >{`${artist.name}${
              index < props.track.artists.length - 1 ? ',\xa0' : ''
            }`}</div>
          ))}
        </div>
      </div>
    </Box>
  );
};

export default memo(ArtistCard);
