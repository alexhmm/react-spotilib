import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Hooks
import useBreakpoints from '../../../../shared/hooks/use-breakpoints.hook';
import usePlayerHttp from '../../../../shared/hooks/use-player-http.hook';

// Styles
import styles from './PlaylistCard.module.scss';

// Types
import { PlaylistCard as IPlaylistCard } from '../../playlist.types';

// UI
import Icon from '../../../../shared/ui/Icon/Icon';
import IconButton from '../../../../shared/ui/IconButton/IconButton';

type PlaylistCardProps = {
  playlist: IPlaylistCard;
};

const PlaylistCard = (props: PlaylistCardProps) => {
  const { lgDown } = useBreakpoints();
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
      className={styles['playlist-card']}
      sx={{
        backgroundColor: 'background.paper',
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
          '.app-link:hover': {
            color: 'primary.main',
          },
          '.play': {
            display: 'none !important',
          },
        },
      }}
    >
      {(props.playlist.images[0] && props.playlist.images[0].url) ||
      (props.playlist.images[1] && props.playlist.images[1].url) ? (
        <img
          alt={props.playlist.name}
          className={clsx(styles['playlist-card-image'], 'image')}
          src={
            lgDown
              ? props.playlist.images[1]?.url
                ? props.playlist.images[1].url
                : props.playlist.images[0]?.url
              : props.playlist.images[0].url
          }
        />
      ) : (
        <div className={clsx(styles['playlist-card-fallback'], 'image')}>
          <Icon icon={['fas', 'music']} size="large" />
        </div>
      )}
      {!isMobile && (
        <div className={clsx(styles['playlist-card-play'], 'play')}>
          <IconButton
            icon={['fas', 'play']}
            iconSize="large"
            padding="1rem"
            onClick={() => onPlay(props.playlist.uri)}
          />
        </div>
      )}
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
