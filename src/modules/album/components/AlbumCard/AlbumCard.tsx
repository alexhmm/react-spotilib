import { Fragment, memo } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Hooks
import useBreakpoints from '../../../../shared/hooks/use-breakpoints.hook';

// Styles
import styles from './AlbumCard.module.scss';

// Types
import { AlbumCard as IAlbumCard } from '../../album.types';

// UI
import { IconButton } from '../../../../shared/ui/IconButton/IconButton';

type AlbumCardProps = {
  album: IAlbumCard;
  onPlay: () => void;
};

const AlbumCard = (props: AlbumCardProps) => {
  const { xxxxxlDown } = useBreakpoints();

  return (
    <Box
      className={styles['album-card']}
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
        alt={props.album.name}
        className={clsx(styles['album-card-image'], 'image')}
        src={xxxxxlDown ? props.album.images[1].url : props.album.images[0].url}
      />
      <div className={clsx(styles['album-card-play'], 'play')}>
        <IconButton
          icon={['fas', 'play']}
          iconSize="large"
          padding="1rem"
          onClick={props.onPlay}
        />
      </div>
      <div className={styles['album-card-name']}>{props.album.name}</div>
      <Box
        className={styles['album-card-data']}
        sx={{
          color: 'text.secondary',
          '.app-link:hover': {
            color: 'primary.main',
          },
        }}
      >
        <time className="inline-block" dateTime={props.album.release_date}>
          {new Date(props.album.release_date).getFullYear()}
          <>{' • '}</>
        </time>
        {props.album.artists.map((artist, index) => (
          <Fragment key={artist.id}>
            <> </>
            <Link
              className={clsx(styles['album-card-data-artist'], 'app-link')}
              to={`/artist/${artist.id}`}
              onClick={() => {
                return false;
              }}
            >
              {artist.name}
            </Link>
            {`${index < props.album.artists.length - 1 ? ',' : ''}`}
          </Fragment>
        ))}
      </Box>
      <Link
        className={clsx(styles['album-card-link'], 'app-link')}
        to={`/album/${props.album.id}`}
      />
    </Box>
  );
};

export default memo(AlbumCard);
