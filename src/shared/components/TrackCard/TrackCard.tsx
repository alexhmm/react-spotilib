import { memo } from 'react';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Hooks
import useBreakpoints from '../../hooks/use-breakpoints.hook';

// Styles
import styles from './TrackCard.module.scss';

// Types
import { TrackCard as ITrackCard } from '../../types/track.types';

// UI
import IconButton from '../../ui/IconButton/IconButton';
import Link from '../../ui/Link/Link';

type TrackCardProps = {
  track: ITrackCard;
  onPlay: () => void;
};

const TrackCard = (props: TrackCardProps) => {
  const { smDown } = useBreakpoints();

  return (
    <Box
      className={styles['track-card']}
      sx={{
        backgroundColor: smDown ? undefined : 'background.paper',
        '@media (hover: hover)': {
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
        },
      }}
      onClick={() => isMobile && props.onPlay()}
    >
      <img
        alt={props.track.album.name}
        className={clsx(styles['track-card-image'], 'image')}
        src={props.track.album.images[2].url}
        onClick={props.onPlay}
      />
      {!isMobile && (
        <IconButton
          classes={clsx(styles['track-card-play'], 'play')}
          icon={['fas', 'play']}
          onClick={props.onPlay}
        />
      )}
      <Box
        className={styles['track-card-info']}
        sx={{
          '.app-link:hover': {
            color: 'primary.main',
          },
        }}
      >
        <div className={styles['track-card-info-track']}>
          {props.track.name}
        </div>
        <div className={styles['track-card-info-artists']}>
          {props.track.artists.map((artist, index) => (
            <Box
              key={artist.id}
              className={styles['track-card-info-artists-item']}
              sx={{ color: 'text.secondary' }}
            >
              {isMobile ? (
                <>{artist.name}</>
              ) : (
                <Link
                  key={artist.id}
                  classes={clsx(
                    styles['track-card-info-artists-item-link'],
                    'app-link'
                  )}
                  to={`/artist/${artist.id}`}
                >{`${artist.name}`}</Link>
              )}
              {`${index < props.track.artists.length - 1 ? ',\xa0' : ''}`}
            </Box>
          ))}
        </div>
      </Box>
    </Box>
  );
};

export default memo(TrackCard);
