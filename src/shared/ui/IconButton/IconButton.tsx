import { forwardRef, memo, ReactNode } from 'react';
import { Button, SxProps, Theme } from '@mui/material';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import clsx from 'clsx';

// Styles
import styles from './IconButton.module.scss';

// Types
import { ColorType } from '../../types/mui.types';
import { ButtonType } from '../../types/ui.types';

// UI
import Icon from '../Icon/Icon';

type IconButtonProps = {
  borderRadius?: string;
  children?: ReactNode;
  classes?: string;
  color?: ColorType;
  disabled?: boolean;
  icon: [IconPrefix, IconName];
  iconSize?: 'small' | 'medium' | 'large';
  id?: string;
  padding?: string;
  preset?: ButtonType;
  sx?: SxProps<Theme>;
  onClick?: (event?: any) => void;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    // Warning: React does not recognize the xxx prop on a DOM element.
    // If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase xxx instead.
    // If you accidentally passed it from a parent component, remove it from the DOM element.
    // https://reactjs.org/warnings/unknown-prop.html
    const { borderRadius, classes, color, disabled, icon, iconSize, ...rest } =
      props;

    // Set button sx by preset
    let sx: SxProps<Theme> | undefined = undefined;
    switch (props.preset) {
      case ButtonType.Primary:
        sx = {
          ...props.sx,
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.light',
          },
        };
        break;
      default:
        sx = {
          ...props.sx,
        };
        break;
    }

    return (
      <Button
        {...rest}
        className={clsx(
          styles['icon-button'],
          borderRadius ?? 'rounded-md',
          classes && classes
        )}
        color={color ?? 'inherit'}
        disabled={disabled && disabled}
        id={props.id}
        ref={ref}
        onClick={props.onClick && props.onClick}
        sx={{
          ...sx,
          padding: props.padding ?? '0.5rem',
        }}
      >
        <Icon
          classes={clsx(
            styles['icon-button-icon'],
            disabled && styles['icon-button-disabled']
          )}
          icon={icon}
          size={iconSize ?? 'small'}
        />
        {props.children && props.children}
      </Button>
    );
  }
);

export default memo(IconButton);
