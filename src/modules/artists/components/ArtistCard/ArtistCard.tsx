import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

// Hooks
import { useBreakpoints } from '../../../../shared/hooks/use-breakpoints.hook';

// Styles
import styles from './ArtistCard.module.scss';

// Types
import { SpotifyArtist } from '../../../../shared/types/spotify.types';

type ArtistCardProps = {
  artist: SpotifyArtist;
};

const ArtistCard = (props: ArtistCardProps) => {
  const { lgDown } = useBreakpoints();
  return (
    <Link className="app-link" to={`/artists/${props.artist.id}`}>
      <Box
        className={styles['artist-card']}
        sx={{
          backgroundColor: 'background.paper',
          ':hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <img
          alt={props.artist.name}
          className={styles['artist-card-image']}
          src={lgDown ? props.artist.images[1].url : props.artist.images[0].url}
        />
        <div className={styles['artist-card-name']}>{props.artist.name}</div>
      </Box>
    </Link>
  );
};

export default memo(ArtistCard);
