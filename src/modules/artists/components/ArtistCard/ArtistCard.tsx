import { memo } from 'react';
import { Box } from '@mui/material';

// Hooks
import { useBreakpoints } from '../../../../shared/hooks/use-breakpoints.hook';

// Styles
import styles from './ArtistCard.module.scss';

// Types
import { Artist } from '../../artists.types';

type ArtistCardProps = {
  artist: Artist;
};

const ArtistCard = (props: ArtistCardProps) => {
  const { lgDown } = useBreakpoints();
  return (
    <Box
      className={styles['artist-card']}
      sx={{ backgroundColor: 'background.paper' }}
    >
      <img
        alt={props.artist.name}
        className={styles['artist-card-image']}
        src={lgDown ? props.artist.images[1].url : props.artist.images[0].url}
      />
      <div className={styles['artist-card-name']}>{props.artist.name}</div>
    </Box>
  );
};

export default memo(ArtistCard);
