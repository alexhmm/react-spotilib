import { memo, ReactNode } from 'react';
import { IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  Button,
  Popover as MuiPopover,
  PopoverOrigin,
} from '@mui/material';
import clsx from 'clsx';

// Styles
import styles from './Popover.module.scss';

// Types
import { ButtonType } from '../../types/ui.types';

// UI
import Icon from '../Icon/Icon';

type PopoverProps = {
  anchor?: HTMLButtonElement;
  anchorOrigin?: PopoverOrigin;
  buttonClasses?: string;
  buttonTitle: string;
  children: ReactNode;
  icon?: [IconPrefix, IconName];
  preset?: ButtonType;
  transformOrigin?: PopoverOrigin;
  widthClasses?: string;
  onClose: () => void;
  onOpen: (anchor: HTMLButtonElement) => void;
};

const Popover = (props: PopoverProps) => {
  return (
    <>
      <Button
        className={clsx(
          styles['popover-button'],
          props.buttonClasses && props.buttonClasses,
          props.widthClasses ?? 'w-fit'
        )}
        color="inherit"
        disableElevation
        sx={{
          borderColor: 'border.app',
          '&:hover': {
            backgroundColor: 'transparent',
            borderColor: 'text.primary',
          },
        }}
        variant="outlined"
        onClick={(event) => props.onOpen(event.currentTarget)}
      >
        <div className={styles['popover-button-text']}>{props.buttonTitle}</div>
        <Icon
          classes={clsx(
            styles['popover-button-icon'],
            props.anchor && !props.icon && styles['popover-button-icon-rotate']
          )}
          icon={props.icon ?? ['fas', 'chevron-down']}
        />
      </Button>
      <MuiPopover
        anchorEl={props.anchor}
        anchorOrigin={
          props.anchorOrigin ?? {
            horizontal: 'right',
            vertical: 'bottom',
          }
        }
        className={styles['popover']}
        classes={{
          paper: styles['popover-paper'],
          root: styles['popover'],
        }}
        open={Boolean(props.anchor)}
        transformOrigin={
          props.transformOrigin ?? {
            horizontal: 'right',
            vertical: 'top',
          }
        }
        onClose={props.onClose}
      >
        <Box
          className={styles['popover-content']}
          sx={{
            backgroundColor: 'background.default',
            borderColor: 'border.app',
          }}
        >
          {props.children}
        </Box>
      </MuiPopover>
    </>
  );
};

export default memo(Popover);
