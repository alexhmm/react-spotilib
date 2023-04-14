import { memo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Components
import DetailDrawer from '../../../../shared/components/DetailDrawer/DetailDrawer';

// Hooks
import usePlaylist from '../../../playlist/use-playlist.hook';
import useTrack from '../../hooks/use-track.hook';

// Styles
import styles from './TrackMore.module.scss';

// Types
import {
  ImageFallbackType,
  TrackAction,
} from '../../../../shared/types/shared.types';

// UI
import IconButton from '../../../../shared/ui/IconButton/IconButton';
import Menu from '../../../../shared/ui/Menu/Menu';

// Utils
import { minutesSecondsByMillisecondsGet } from '../../../../shared/utils/shared.utils';

type TrackMoreProps = {
  duration: number;
  image?: string;
  owner?: boolean;
  subtitle?: string;
  title: string;
  type: ImageFallbackType;
  onAction: (action: TrackAction) => void;
};

const TrackMore = (props: TrackMoreProps) => {
  const { playlistTrackActionsGet } = usePlaylist();
  const { trackActionsGet } = useTrack();

  // Get track actions by type
  let trackActions = trackActionsGet();
  if (props.type === ImageFallbackType.Playlist) {
    trackActions = playlistTrackActionsGet(props.owner);
  }

  // Component state
  const [detailDrawer, setDetailDrawer] = useState<boolean>(false);

  return (
    <Box className={styles['track-more']} sx={{ color: 'text.secondary' }}>
      {!isMobile && (
        <IconButton
          classes="favorite"
          icon={['far', 'heart']}
          onClick={() => props.onAction(TrackAction.Favorite)}
        />
      )}
      <span className={styles['track-more-duration']}>
        {minutesSecondsByMillisecondsGet(props.duration)}
      </span>
      {isMobile ? (
        <IconButton
          classes={styles['track-more-button']}
          icon={['fas', 'ellipsis-v']}
          onClick={() => setDetailDrawer(true)}
        />
      ) : (
        <Menu
          classes={clsx(styles['track-more-button'], 'more')}
          hideItemIcon
          icon={['fas', 'ellipsis']}
          items={trackActions}
          onAction={props.onAction}
        />
      )}
      <DetailDrawer
        actionItems={trackActions}
        image={props.image}
        open={detailDrawer}
        subtitle={props.subtitle}
        title={props.title}
        type={props.type}
        onAction={props.onAction}
        onClose={() => setDetailDrawer(false)}
      />
    </Box>
  );
};

export default memo(TrackMore);
