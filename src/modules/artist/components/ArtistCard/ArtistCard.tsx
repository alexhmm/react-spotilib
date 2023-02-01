import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Hooks
import useBreakpoints from '../../../../shared/hooks/use-breakpoints.hook';

// Styles
import styles from './ArtistCard.module.scss';

// Types
import { ArtistCard as IArtistCard } from '../../artist.types';

// UI
import IconButton from '../../../../shared/ui/IconButton/IconButton';

type ArtistCardProps = {
  artist: IArtistCard;
  onPlay: () => void;
};

const ArtistCard = (props: ArtistCardProps) => {
  const { lgDown } = useBreakpoints();
  return (
    <Box
      className={styles['artist-card']}
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
        alt={props.artist.name}
        className={clsx(styles['artist-card-image'], 'image')}
        src={lgDown ? props.artist.images[1]?.url : props.artist.images[0]?.url}
      />
      <div className={clsx(styles['artist-card-play'], 'play')}>
        <IconButton
          icon={['fas', 'play']}
          iconSize="large"
          padding="1rem"
          onClick={props.onPlay}
        />
      </div>
      <div className={styles['artist-card-name']}>{props.artist.name}</div>
      <Link
        className={clsx(styles['artist-card-link'], 'app-link')}
        to={`/artist/${props.artist.id}`}
      />
    </Box>
  );
};

export default memo(ArtistCard);
