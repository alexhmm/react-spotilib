import { memo, ReactNode, useEffect, useState } from 'react';
import { Button, SxProps, Theme } from '@mui/material';
import clsx from 'clsx';

// Styles
import styles from './TextButtonContained.module.scss';

// Types
import { ColorType } from '../../types/mui.types';
import { ButtonType } from '../../types/ui.types';

type TextButtonContainedProps = {
  children: ReactNode;
  classes?: string;
  preset?: ButtonType;
  sx?: SxProps<Theme>;
  onClick?: () => void;
};

const TextButtonContained = (props: TextButtonContainedProps) => {
  const [sx, setSx] = useState<SxProps<Theme> | undefined>(undefined);

  // Set button sx by preset
  useEffect(() => {
    switch (props.preset) {
      case ButtonType.Primary:
        setSx({
          ...props.sx,
          backgroundColor: 'background.paper',
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'white',
          },
        });
        break;
      case ButtonType.Selected:
        setSx({
          ...props.sx,
          backgroundColor: 'action.selected',
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.selected',
          },
        });
        break;
      default:
        setSx({
          ...props.sx,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        });
        break;
    }
  }, [props.preset, props.sx]);

  let color: ColorType = 'inherit';

  switch (props.preset) {
    case ButtonType.Primary:
      color = 'primary';
      break;
    default:
      break;
  }

  return (
    <Button
      className={clsx(
        styles['text-button-contained'],
        props.classes && props.classes
      )}
      color={color}
      sx={{ ...sx }}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
};

export default memo(TextButtonContained);
