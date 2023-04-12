import { ReactNode, memo } from 'react';
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
import IconButton from '../../ui/IconButton/IconButton';

type DetailDrawerActionButtonProps = {
  icon?: [IconPrefix, IconName];
  title: string;
  onClick: () => void;
};

const DetailDrawerActionButton = (props: DetailDrawerActionButtonProps) => {
  return (
    <Button
      className={styles['detail-drawer-action-button']}
      color="inherit"
      onClick={props.onClick}
    >
      {props.icon && (
        <Icon
          classes={styles['detail-drawer-action-button-icon']}
          icon={props.icon}
          sx={{ color: 'text.secondary' }}
        />
      )}
      <span className={styles['detail-drawer-action-button-title']}>
        {props.title}
      </span>
    </Button>
  );
};

type ActionDrawerProps = {
  children?: ReactNode;
  actionItems?: MenuItem[];
  image?: string;
  imageBorderRadius?: string;
  open?: boolean;
  subtitle?: string;
  title: string;
  type?: ImageFallbackType;
  onAction?: (action: any) => void;
  onClose: () => void;
};

const ActionDrawer = (props: ActionDrawerProps) => {
  return (
    <Drawer
      anchor="bottom"
      classes={{
        paper: styles['detail-drawer'],
      }}
      hideBackdrop
      open={props.open}
      PaperProps={{
        sx: {
          backgroundColor: 'background.default',
          backgroundImage: 'unset',
        },
      }}
    >
      <div className={styles['detail-drawer-title']}>
        <div className={styles['detail-drawer-title-close']}></div>
        <div className={styles['detail-drawer-title-text']}>
          {props.title && props.title}
        </div>
        <IconButton
          classes={styles['detail-drawer-title-close']}
          icon={['fas', 'times']}
          onClick={props.onClose}
        />
      </div>
      <div className={styles['detail-drawer-content']}>
        {props.children && props.children}
        {props.actionItems && props.onAction && (
          <>
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
                  classes={clsx(
                    props.imageBorderRadius && props.imageBorderRadius
                  )}
                  type={props.type ?? ImageFallbackType.Playlist}
                />
              )}
            </div>
            <div className={styles['detail-drawer-content-title']}>
              {props.title}
            </div>
            {props.subtitle && (
              <Box
                className={styles['detail-drawer-content-subtitle']}
                sx={{ color: 'text.secondary' }}
              >
                {props.subtitle}
              </Box>
            )}
            <div className={styles['detail-drawer-content-items']}>
              {props.actionItems.map((item, index) => (
                <DetailDrawerActionButton
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  onClick={() => props.onAction && props.onAction(item.action)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default memo(ActionDrawer);
