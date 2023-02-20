import { memo, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Snackbar as MuiSnackbar, SnackbarCloseReason } from '@mui/material';

// Stores
import useSharedStore from '../../stores/use-shared.store';

const Snackbar = () => {
  const [open, setOpen] = useState<boolean>(false);

  // Shared store state
  const [notification, setNotification] = useSharedStore((state) => [
    state.notification,
    state.setNotification,
  ]);

  // Open snackbar on notification
  useEffect(() => {
    notification?.title && setOpen(true);
  }, [notification?.title]);

  /**
   * Handler to close notification.
   */
  const onClose = useCallback(
    (
      event: Event | SyntheticEvent<any, Event>,
      reason: SnackbarCloseReason
    ) => {
      if (reason === 'timeout') {
        setOpen(false);
        // Wait for animation
        setTimeout(() => {
          setNotification(undefined);
        }, 500);
      }
    },
    // eslint-disable-next-line
    []
  );

  return (
    <MuiSnackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      autoHideDuration={notification?.timeout ?? 5000}
      open={open ? true : false}
      message={notification?.title ?? ''}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '0.375rem',
          '--tw-shadow':
            '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          '--tw-shadow-colored':
            '0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color)',
          boxShadow:
            'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
          '.MuiSnackbarContent-message': {
            fontWeight: 600,
            textAlign: 'center',
            width: '100%',
          },
        },
      }}
      onClose={onClose}
    />
  );
};

export default memo(Snackbar);
