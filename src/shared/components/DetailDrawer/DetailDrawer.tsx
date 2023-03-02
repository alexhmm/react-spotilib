import { memo } from 'react';
import { Box, Button, Drawer } from '@mui/material';
import { IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

// Components
import ImageFallback from '../ImageFallback/ImageFallback';

// Styles
import styles from './DetailDrawer.module.scss';

// Types
import { ImageFallbackType, MenuItem } from '../../types/shared.types';

// UI
import Icon from '../../ui/Icon/Icon';
import TextButton from '../../ui/TextButton/TextButton';

type DetailDrawerButtonProps = {
  icon?: [IconPrefix, IconName];
  title: string;
  onClick: () => void;
};

const DetailDrawerButton = (props: DetailDrawerButtonProps) => {
  return (
    <Button
      className={styles['detail-drawer-button']}
      color="inherit"
      onClick={props.onClick}
    >
      {props.icon && (
        <Icon
          classes={styles['detail-drawer-button-icon']}
          icon={props.icon}
          sx={{ color: 'text.secondary' }}
        />
      )}
      <span className={styles['detail-drawer-button-title']}>
        {props.title}
      </span>
    </Button>
  );
};

type DetailDrawerProps = {
  items: MenuItem[];
  image?: string;
  imageBorderRadius?: string;
  open?: boolean;
  subtitle?: string;
  title: string;
  type: ImageFallbackType;
  onAction: (action: any) => void;
  onClose: () => void;
};

const DetailDrawer = (props: DetailDrawerProps) => {
  return (
    <Drawer
      anchor="bottom"
      classes={{
        paper: styles['detail-drawer'],
      }}
      hideBackdrop
      open={props.open}
      PaperProps={{
        onClick: props.onClose,
        sx: {
          backgroundColor: 'background.default',
          backgroundImage: 'unset',
        },
      }}
      onClose={props.onClose}
    >
      <div className={styles['detail-drawer-content']}>
        <div className={styles['detail-drawer-content-image']}>
          {props.image ? (
            <img
              alt={props.title}
              className={clsx(
                props.imageBorderRadius && props.imageBorderRadius
              )}
              src={props.image}
            />
          ) : (
            <ImageFallback
              classes={clsx(props.imageBorderRadius && props.imageBorderRadius)}
              type={props.type}
            />
          )}
        </div>
        <div className={styles['detail-drawer-content-title']}>
          {props.title}
        </div>
        {
          <Box
            className={styles['detail-drawer-content-subtitle']}
            sx={{ color: 'text.secondary' }}
          >
            {props.subtitle}
          </Box>
        }
        <div className={styles['detail-drawer-content-items']}>
          {props.items.map((item, index) => (
            <DetailDrawerButton
              key={index}
              icon={item.icon}
              title={item.title}
              onClick={() => props.onAction(item.action)}
            />
          ))}
        </div>
      </div>
      <div className={styles['detail-drawer-close']}>
        <TextButton onClick={props.onClose}>Close</TextButton>
      </div>
    </Drawer>
  );
};

export default memo(DetailDrawer);
