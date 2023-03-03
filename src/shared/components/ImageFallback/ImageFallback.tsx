import { memo } from 'react';
import { IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Styles
import styles from './ImageFallback.module.scss';

// Types
import { FontSize } from '../../types/mui.types';
import { ImageFallbackType } from '../../types/shared.types';

// UI
import Icon from '../../ui/Icon/Icon';

type ImageFallbackProps = {
  classes?: string;
  size?: FontSize;
  type: ImageFallbackType;
};

const ImageFallback = (props: ImageFallbackProps) => {
  let icon: [IconPrefix, IconName] | undefined = undefined;

  switch (props.type) {
    case ImageFallbackType.Album:
      icon = ['fas', 'record-vinyl'];
      break;
    case ImageFallbackType.Artist:
    case ImageFallbackType.Profile:
      icon = ['fas', 'user'];
      break;
    default:
      icon = ['fas', 'music'];
      break;
  }

  return (
    <>
      {icon && (
        <Box
          className={clsx(
            styles['image-fallback'],
            props.classes && props.classes,
            (props.type === ImageFallbackType.Artist ||
              props.type === ImageFallbackType.Profile) &&
              'rounded-full'
          )}
          sx={{ backgroundColor: 'background.paper' }}
        >
          <Icon
            icon={icon}
            size={props.size ?? 'large'}
            sx={{ color: 'text.secondary' }}
          />
        </Box>
      )}
    </>
  );
};

export default memo(ImageFallback);
