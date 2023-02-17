import { memo, ReactNode } from 'react';
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
  // Set button color and sx by preset
  let color: ColorType = 'inherit';
  let sx: SxProps<Theme> | undefined = undefined;

  switch (props.preset) {
    case ButtonType.Primary:
      color = 'primary';
      sx = {
        ...props.sx,
        backgroundColor: 'background.paper',
        color: 'primary.main',
        '&:hover': {
          backgroundColor: 'primary.main',
          color: 'white',
        },
      };
      break;
    case ButtonType.Selected:
      sx = {
        ...props.sx,
        backgroundColor: 'action.selected',
        color: 'text.primary',
        '&:hover': {
          backgroundColor: 'action.selected',
        },
      };
      break;
    default:
      sx = {
        ...props.sx,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      };
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
