import { Fragment, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Components
import ImageFallback from '../../../../shared/components/ImageFallback/ImageFallback';

// Hooks
import useBreakpoints from '../../../../shared/hooks/use-breakpoints.hook';
import usePlayerHttp from '../../../../shared/hooks/use-player-http.hook';

// Styles
import styles from './AlbumCard.module.scss';

// Types
import { AlbumCard as IAlbumCard } from '../../album.types';
import { ImageFallbackType } from '../../../../shared/types/shared.types';
import { ButtonType } from '../../../../shared/types/ui.types';

// UI
import IconButton from '../../../../shared/ui/IconButton/IconButton';

type AlbumCardProps = {
  album: IAlbumCard;
};

const AlbumCard = (props: AlbumCardProps) => {
  const { lgDown, smDown } = useBreakpoints();
  const { playPutMutation } = usePlayerHttp();

  // ######### //
  // CALLBACKS //
  // ######### //

  /**
   * Handler to play playlist by uri.
   * @param contextUri Spotify URI of the context to play
   */
  const onPlay = useCallback((contextUri: string) => {
    playPutMutation.mutate({
      body: {
        context_uri: contextUri,
      },
    });
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      className={clsx(styles['album-card'], 'no-highlight')}
      sx={{
        backgroundColor: smDown ? undefined : 'background.paper',
        '@media (hover: hover)': {
          ':hover': {
            backgroundColor: 'action.hover',
            '.play': {
              opacity: 1,
              transform: 'translateY(-0.5rem)',
            },
          },
          '.app-link:hover': {
            color: 'primary.main',
          },
          '.play': {
            opacity: 0,
          },
        },
      }}
    >
      <div className={clsx(styles['album-card-image'], 'image')}>
        {(props.album.images[0] && props.album.images[0].url) ||
        (props.album.images[1] && props.album.images[1].url) ? (
          <img
            alt={props.album.name}
            src={
              lgDown
                ? props.album.images[1]?.url
                  ? props.album.images[1].url
                  : props.album.images[0]?.url
                : props.album.images[0].url
            }
          />
        ) : (
          <ImageFallback
            classes="sm:rounded-md"
            type={ImageFallbackType.Album}
          />
        )}
        {!isMobile && !smDown && (
          <IconButton
            borderRadius="rounded-full"
            classes={clsx(styles['album-card-image-play'], 'play')}
            icon={['fas', 'play']}
            iconSize="medium"
            padding="0.75rem"
            preset={ButtonType.Primary}
            sx={{
              svg: {
                transform: 'translateX(2px)',
              },
            }}
            onClick={() => onPlay(props.album.uri)}
          />
        )}
      </div>
      <div className={styles['album-card-info']}>
        <div className={styles['album-card-info-name']}>{props.album.name}</div>
        <Box
          className={styles['album-card-info-data']}
          sx={{
            color: 'text.secondary',
            '.app-link:hover': {
              color: 'primary.main',
            },
            zIndex: isMobile ? undefined : 10,
          }}
        >
          {!smDown && (
            <time className="inline-block" dateTime={props.album.release_date}>
              {new Date(props.album.release_date).getFullYear()}
              <>{' • '}</>
            </time>
          )}
          {props.album.artists.map((artist, index) => (
            <Fragment key={artist.id}>
              <> </>
              {isMobile ? (
                <Box
                  className={styles['album-card-info-data-artist']}
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  {artist.name}
                </Box>
              ) : (
                <Link
                  className={clsx(
                    styles['album-card-info-data-artist'],
                    styles['album-card-info-data-artist-link'],
                    'app-link'
                  )}
                  to={`/artist/${artist.id}`}
                  onClick={() => {
                    return false;
                  }}
                >
                  {artist.name}
                </Link>
              )}

              {`${index < props.album.artists.length - 1 ? ',' : ''}`}
            </Fragment>
          ))}
        </Box>
      </div>
      <Link
        className={clsx(styles['album-card-link'], 'app-link')}
        to={`/album/${props.album.id}`}
      />
    </Box>
  );
};

export default memo(AlbumCard);
