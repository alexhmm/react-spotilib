import { memo, ReactNode, useEffect, useState } from 'react';
import { Button, SxProps, Theme } from '@mui/material';
import clsx from 'clsx';

// Styles
import styles from './TextButtonOutlined.module.scss';

// Types
import { ButtonType } from '../../types/ui.types';

type TextButtonOutlinedProps = {
  children: ReactNode;
  classes?: string;
  preset?: ButtonType;
  sx?: SxProps<Theme>;
  onClick?: () => void;
};

const TextButtonOutlined = (props: TextButtonOutlinedProps) => {
  const [sx, setSx] = useState<SxProps<Theme> | undefined>(undefined);

  // Set button sx by preset
  useEffect(() => {
    switch (props.preset) {
      case ButtonType.Primary:
        setSx({
          ...props.sx,
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.main',
            borderColor: 'primary.main',
            color: 'white',
          },
        });
        break;
      default:
        setSx({
          ...props.sx,
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'text.primary',
            borderColor: 'text.primary',
            color: 'background.default',
          },
        });
        break;
    }
  }, [props.preset, props.sx]);

  return (
    <>
      {sx && (
        <Button
          classes={{
            root: clsx(
              styles['text-button-outlined'],
              props.classes && props.classes
            ),
          }}
          color="inherit"
          variant="outlined"
          sx={{ ...sx }}
          onClick={props.onClick && props.onClick}
        >
          {props.children}
        </Button>
      )}
    </>
  );
};

export default memo(TextButtonOutlined);
