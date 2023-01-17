import { forwardRef, ReactNode } from 'react';
import { Button } from '@mui/material';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import clsx from 'clsx';

// Styles
import styles from './IconButton.module.scss';

// UI
import { Icon } from '../Icon/Icon';

type IconButtonProps = {
  children?: ReactNode;
  classes?: string;
  disabled?: boolean;
  icon: [IconPrefix, IconName];
  iconSize?: 'small' | 'medium' | 'large';
  padding?: string;
  onClick?: (event?: any) => void;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    // Warning: React does not recognize the xxx prop on a DOM element.
    // If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase xxx instead.
    // If you accidentally passed it from a parent component, remove it from the DOM element.
    // https://reactjs.org/warnings/unknown-prop.html
    const { classes, disabled, icon, iconSize, ...rest } = props;

    return (
      <Button
        {...rest}
        className={clsx(styles['icon-button'], classes && classes)}
        color="inherit"
        disabled={disabled && disabled}
        ref={ref}
        onClick={props.onClick && props.onClick}
        sx={{
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
          sx={{ color: 'text.primary' }}
        />
        {props.children && props.children}
      </Button>
    );
  }
);
