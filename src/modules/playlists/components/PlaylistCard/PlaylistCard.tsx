import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Hooks
import { useBreakpoints } from '../../../../shared/hooks/use-breakpoints.hook';

// Styles
import styles from './PlaylistCard.module.scss';

// Types
import { PlaylistCard as IPlaylistCard } from '../../playlists.types';

// UI
import { IconButton } from '../../../../shared/ui/IconButton/IconButton';

type PlaylistCardProps = {
  playlist: IPlaylistCard;
  onPlay: () => void;
};

const PlaylistCard = (props: PlaylistCardProps) => {
  const { lgDown } = useBreakpoints();
  return (
    <Box
      className={styles['playlist-card']}
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
        '.app-link:hover': {
          color: 'primary.main',
        },
        '.play': {
          display: 'none !important',
        },
      }}
    >
      <img
        alt={props.playlist.name}
        className={clsx(styles['playlist-card-image'], 'image')}
        src={
          lgDown ? props.playlist.images[1]?.url : props.playlist.images[0]?.url
        }
      />
      <div className={clsx(styles['playlist-card-play'], 'play')}>
        <IconButton
          icon={['fas', 'play']}
          iconSize="large"
          padding="1rem"
          onClick={props.onPlay}
        />
      </div>
      <div className={styles['playlist-card-name']}>{props.playlist.name}</div>
      <Link
        className={clsx(styles['playlist-card-owner'], 'app-link')}
        to={`/user/${props.playlist.owner.id}`}
      >
        {props.playlist.owner.display_name}
      </Link>
      <Link
        className={clsx(styles['playlist-card-link'], 'app-link')}
        to={`/playlist/${props.playlist.id}`}
      />
    </Box>
  );
};

export default memo(PlaylistCard);
