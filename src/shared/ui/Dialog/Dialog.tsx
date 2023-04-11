import { memo, ReactNode } from 'react';
import {
  Dialog as MuiDialog,
  DialogContent,
  DialogTitle,
  Box,
} from '@mui/material';
import clsx from 'clsx';

// Stores
import useThemeStore from '../../stores/use-theme.store';

// Styles
import styles from './Dialog.module.scss';
import IconButton from '../IconButton/IconButton';

// Types
import { Theme } from '../../types/shared.types';

type DialogProps = {
  children: ReactNode;
  className?: string;
  open: boolean;
  title: string;
  onClose: () => void;
};

const Dialog = (props: DialogProps) => {
  // Shared store state
  const [theme] = useThemeStore((state) => [state.theme]);

  return (
    <MuiDialog
      classes={{
        paper: clsx(styles['dialog'], props.className && props.className),
      }}
      open={props.open}
      onClose={props.onClose}
    >
      <Box
        sx={{
          backgroundColor: theme === Theme.Dark ? 'bg.card' : undefined,
        }}
      >
        <DialogTitle className={styles['dialog-title']}>
          <div className={styles['dialog-title-text']}>{props.title}</div>
          <IconButton
            classes={styles['dialog-title-close']}
            icon={['fas', 'times']}
            onClick={props.onClose}
          />
        </DialogTitle>
        <DialogContent>{props.children}</DialogContent>
      </Box>
    </MuiDialog>
  );
};

export default memo(Dialog);
