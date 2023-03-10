import { memo, useCallback } from 'react';
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
import styles from './ArtistCard.module.scss';

// Types
import { ArtistCard as IArtistCard } from '../../artist.types';
import { ImageFallbackType } from '../../../../shared/types/shared.types';
import { ButtonType } from '../../../../shared/types/ui.types';

// UI
import IconButton from '../../../../shared/ui/IconButton/IconButton';

type ArtistCardProps = {
  artist: IArtistCard;
};

const ArtistCard = (props: ArtistCardProps) => {
  const { smDown, lgDown } = useBreakpoints();
  const { playPutMutation } = usePlayerHttp();

  /**
   * Handler to play artist by uri.
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
      className={styles['artist-card']}
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
      <div className={clsx(styles['artist-card-image'], 'image')}>
        {(props.artist.images[0] && props.artist.images[0].url) ||
        (props.artist.images[1] && props.artist.images[1].url) ? (
          <img
            alt={props.artist.name}
            src={
              lgDown
                ? props.artist.images[1]?.url
                  ? props.artist.images[1].url
                  : props.artist.images[0]?.url
                : props.artist.images[0].url
            }
          />
        ) : (
          <ImageFallback type={ImageFallbackType.Artist} />
        )}
        {!isMobile && !smDown && (
          <IconButton
            borderRadius="rounded-full"
            classes={clsx(styles['artist-card-image-play'], 'play')}
            icon={['fas', 'play']}
            iconSize="medium"
            padding="0.75rem"
            preset={ButtonType.Primary}
            sx={{
              svg: {
                transform: 'translateX(2px)',
              },
            }}
            onClick={() => onPlay(props.artist.uri)}
          />
        )}
      </div>
      <div className={styles['artist-card-name']}>{props.artist.name}</div>
      <Link
        className={styles['artist-card-link']}
        to={`/artist/${props.artist.id}`}
      />
    </Box>
  );
};

export default memo(ArtistCard);
