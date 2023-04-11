import { memo, ReactNode } from 'react';
import { Button, SxProps, Theme } from '@mui/material';
import clsx from 'clsx';

// Styles
import styles from './TextButtonOutlined.module.scss';

// Types
import { ColorType } from '../../types/mui.types';
import { ButtonType } from '../../types/ui.types';

type TextButtonOutlinedProps = {
  children: ReactNode;
  classes?: string;
  preset?: ButtonType;
  sx?: SxProps<Theme>;
  type?: 'reset' | 'submit';
  onClick?: () => void;
};

const TextButtonOutlined = (props: TextButtonOutlinedProps) => {
  // Set button color and sx by preset
  let color: ColorType = 'inherit';
  let sx: SxProps<Theme> | undefined = undefined;

  switch (props.preset) {
    case ButtonType.Selected:
      sx = {
        ...props.sx,
        backgroundColor: 'background.default',
        borderColor: 'text.primary',
        color: 'text.primary',
        '&:hover': {
          backgroundColor: 'background.default',
          borderColor: 'text.primary',
        },
      };
      break;
    case ButtonType.Primary:
      sx = {
        ...props.sx,
        color: 'primary.main',
        '&:hover': {
          backgroundColor: 'primary.main',
          borderColor: 'primary.main',
          color: 'white',
        },
      };
      break;
    default:
      sx = {
        ...props.sx,
        backgroundColor: 'transparent',
        borderColor: 'action.selected',
        color: 'text.primary',
        '&:hover': {
          backgroundColor: 'transparent',
          borderColor: 'text.primary',
        },
      };
      break;
  }

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
          color={color}
          variant="outlined"
          sx={{ ...sx }}
          type={props.type}
          onClick={props.onClick && props.onClick}
        >
          {props.children}
        </Button>
      )}
    </>
  );
};

export default memo(TextButtonOutlined);
