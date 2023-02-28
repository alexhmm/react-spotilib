import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Components
import ImageFallback from '../../../../shared/components/ImageFallback/ImageFallback';

// Hooks
import useBreakpoints from '../../../../shared/hooks/use-breakpoints.hook';
import usePlayerHttp from '../../../../shared/hooks/use-player-http.hook';

// Styles
import styles from './PlaylistCard.module.scss';

// Types
import { PlaylistCard as IPlaylistCard } from '../../playlist.types';
import { ImageFallbackType } from '../../../../shared/types/shared.types';
import { ButtonType } from '../../../../shared/types/ui.types';

// UI
import IconButton from '../../../../shared/ui/IconButton/IconButton';

type PlaylistCardProps = {
  hideOwner?: boolean;
  playlist: IPlaylistCard;
};

const PlaylistCard = (props: PlaylistCardProps) => {
  const { smDown, lgDown } = useBreakpoints();
  const { playPutMutation } = usePlayerHttp();
  const { t } = useTranslation();

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
      className={styles['playlist-card']}
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
      <div className={clsx(styles['playlist-card-image'], 'image')}>
        {(props.playlist.images[0] && props.playlist.images[0].url) ||
        (props.playlist.images[1] && props.playlist.images[1].url) ? (
          <img
            alt={props.playlist.name}
            src={
              lgDown
                ? props.playlist.images[1]?.url
                  ? props.playlist.images[1].url
                  : props.playlist.images[0]?.url
                : props.playlist.images[0].url
            }
          />
        ) : (
          <ImageFallback
            classes="sm:rounded-md"
            type={ImageFallbackType.Playlist}
          />
        )}
        {!isMobile && !smDown && (
          <IconButton
            borderRadius="rounded-full"
            classes={clsx(styles['playlist-card-image-play'], 'play')}
            icon={['fas', 'play']}
            iconSize="medium"
            padding="0.75rem"
            preset={ButtonType.Primary}
            sx={{
              svg: {
                transform: 'translateX(2px)',
              },
            }}
            onClick={() => onPlay(props.playlist.uri)}
          />
        )}
      </div>
      <div className={styles['playlist-card-info']}>
        <div className={styles['playlist-card-info-name']}>
          {props.playlist.name}
        </div>
        {!props.hideOwner ? (
          <>
            {props.playlist.owner.id !== 'spotify' ? (
              <div className={styles['playlist-card-info-owner']}>
                {!smDown && (
                  <>
                    <Box
                      className={styles['playlist-card-info-owner-from']}
                      sx={{ color: 'text.secondary' }}
                    >
                      {t('app.from')}
                    </Box>
                    <span className="whitespace-pre-wrap shrink-0"> </span>
                  </>
                )}
                {isMobile ? (
                  <Box
                    className={styles['playlist-card-info-owner-name']}
                    sx={{ color: 'text.secondary' }}
                  >
                    {props.playlist.owner.display_name}
                  </Box>
                ) : (
                  <Link
                    className={clsx(
                      styles['playlist-card-info-owner-link'],
                      styles['playlist-card-info-owner-name'],

                      'app-link'
                    )}
                    to={`/user/${props.playlist.owner.id}`}
                  >
                    {props.playlist.owner.display_name}
                  </Link>
                )}
              </div>
            ) : (
              <Box
                className={styles['playlist-card-info-description']}
                sx={{ color: 'text.secondary' }}
              >
                {props.playlist.description}
              </Box>
            )}
          </>
        ) : (
          <div className={styles['playlist-card-info-owner']}></div>
        )}
      </div>
      <Link
        className={clsx(styles['playlist-card-link'], 'app-link')}
        to={`/playlist/${props.playlist.id}`}
      />
    </Box>
  );
};

export default memo(PlaylistCard);
