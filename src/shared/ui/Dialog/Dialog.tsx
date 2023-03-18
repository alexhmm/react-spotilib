import { memo, ReactNode } from 'react';
import { Dialog as MuiDialog, DialogContent, DialogTitle } from '@mui/material';
import clsx from 'clsx';

// Styles
import styles from './Dialog.module.scss';
import IconButton from '../IconButton/IconButton';

type DialogProps = {
  children: ReactNode;
  className?: string;
  open: boolean;
  title: string;
  onClose: () => void;
};

const Dialog = (props: DialogProps) => {
  return (
    <MuiDialog
      classes={{
        paper: clsx(styles['dialog'], props.className && props.className),
      }}
      open={props.open}
    >
      <DialogTitle className={styles['dialog-title']}>
        <div className={styles['dialog-title-text']}>{props.title}</div>
        <IconButton icon={['fas', 'times']} onClick={props.onClose} />
      </DialogTitle>
      <DialogContent>{props.children}</DialogContent>
    </MuiDialog>
  );
};

export default memo(Dialog);
