import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Styles
import styles from './TrackCard.module.scss';

// Types
import { TrackCard as ITrackCard } from '../../track.types';

// UI
import { IconButton } from '../../../../shared/ui/IconButton/IconButton';

type TrackCardProps = {
  track: ITrackCard;
  onPlay: () => void;
};

const TrackCard = (props: TrackCardProps) => {
  return (
    <Box
      className={styles['track-card']}
      sx={{
        backgroundColor: 'background.paper',
        ':hover': {
          backgroundColor: 'action.hover',
          '.image': {
            display: 'none',
          },
          '.play': {
            display: 'flex !important',
          },
        },
        '.play': {
          display: 'none !important',
        },
      }}
    >
      <img
        alt={props.track.album.name}
        className={clsx(styles['track-card-image'], 'image')}
        src={props.track.album.images[2].url}
        onClick={props.onPlay}
      />
      <IconButton
        classes="play"
        icon={['fas', 'play']}
        onClick={props.onPlay}
      />
      <Box
        className={styles['track-card-info']}
        sx={{
          '.app-link:hover': {
            color: 'primary.main',
          },
        }}
      >
        <Link
          className={clsx(styles['track-card-info-track'], 'app-link', 'link')}
          to={`/tracks/${props.track.id}`}
        >
          {props.track.name}
        </Link>
        <div className={styles['track-card-info-artists']}>
          {props.track.artists.map((artist, index) => (
            <Box
              key={artist.id}
              className={styles['track-card-info-artists-item']}
              sx={{ color: 'text.secondary' }}
            >
              <Link
                key={artist.id}
                className={clsx(
                  styles['track-card-info-artists-item-link'],
                  'app-link'
                )}
                to={`/artists/${artist.id}`}
              >{`${artist.name}`}</Link>
              {`${index < props.track.artists.length - 1 ? ',\xa0' : ''}`}
            </Box>
          ))}
        </div>
      </Box>
    </Box>
  );
};

export default memo(TrackCard);
