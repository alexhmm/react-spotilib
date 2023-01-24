import { Fragment, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Hooks
import { useBreakpoints } from '../../../../shared/hooks/use-breakpoints.hook';

// Styles
import styles from './AlbumCard.module.scss';

// Types
import { AlbumCard as IAlbumCard } from '../../albums.types';

type AlbumCardProps = {
  album: IAlbumCard;
};

const AlbumCard = (props: AlbumCardProps) => {
  const { xxxxxlDown } = useBreakpoints();
  const navigate = useNavigate();

  // #TODO: album-card onClick and Artist Link not working together well...
  return (
    <Link className="app-link" to={`/album/${props.album.id}`}>
      <Box
        className={styles['album-card']}
        sx={{
          backgroundColor: 'background.paper',
          ':hover': {
            backgroundColor: 'action.hover',
          },
        }}
        onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}
      >
        <img
          alt={props.album.name}
          className={styles['album-card-image']}
          src={
            xxxxxlDown ? props.album.images[1].url : props.album.images[0].url
          }
        />
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
              {/* <Link
              className={clsx(styles['album-card-data-artist'], 'app-link')}
              to={`/artists/${artist.id}`}
              onClick={() => {
                return false;
              }}
            >
              {artist.name}
            </Link> */}
              <span className={styles['album-card-data-artist']}>
                {artist.name}
              </span>
              {`${index < props.album.artists.length - 1 ? ',' : ''}`}
            </Fragment>
          ))}
        </Box>
      </Box>
    </Link>
  );
};

export default memo(AlbumCard);
