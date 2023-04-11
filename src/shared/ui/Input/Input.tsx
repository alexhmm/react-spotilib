import { memo, useEffect, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Box, OutlinedInput, SxProps, Theme } from '@mui/material';
import clsx from 'clsx';

// Hooks
import { themeDark, themeLight } from '../../hooks/use-theme.hook';

// Stores
import useThemeStore from '../../stores/use-theme.store';

// Styles
import styles from './Input.module.scss';

// Types
import { Theme as ETheme, ResultState } from '../../types/shared.types';

type InputProps = {
  classes?: string;
  defaultValue?: string;
  disabled?: boolean;
  fullHeight?: boolean;
  label: string;
  multiline?: number;
  padding?: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
  state?: ResultState;
  onChange?: (value: string) => void;
};

const Input = (props: InputProps) => {
  // Component state
  const [sxColors, setSxColors] = useState<SxProps<Theme> | undefined>(
    undefined
  );
  const [label, setLabel] = useState<string | undefined>(undefined);

  // Shared store state
  const [theme] = useThemeStore((state) => [state.theme]);

  // Set input colors by result state and theme
  useEffect(() => {
    let color: string | undefined = undefined;
    switch (props.state) {
      case ResultState.Error:
        color = 'error.main';
        break;
      case ResultState.Info:
        color = 'info.main';
        break;
      case ResultState.Success:
        color = 'success.main';
        break;
      case ResultState.Warning:
        color = 'warning.main';
        break;
      default:
        break;
    }

    setSxColors({
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'bg.form',
      },
      '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
        borderColor: color ? color : 'transparent',
        borderWidth: '1px',
      },
      '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: color ? color : 'border.card',
      },
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: color ? color : 'text.primary',
      },
    });
  }, [props.state, theme]);

  return (
    <Box
      className={styles['input']}
      sx={{
        ...sxColors,
        height: props.fullHeight ? '100%' : undefined,
        '& .MuiOutlinedInput-input': {
          padding: props.padding ?? '0.5rem',
        },
      }}
    >
      <Box
        className={styles['input-label']}
        sx={{
          background: `linear-gradient(180deg, ${
            theme === ETheme.Dark
              ? themeDark.palette.bg.card
              : themeLight.palette.bg.card
          } 50%, ${
            theme === ETheme.Dark
              ? themeDark.palette.bg.form
              : themeLight.palette.bg.form
          } 0.1%, ${
            theme === ETheme.Dark
              ? themeDark.palette.bg.form
              : themeLight.palette.bg.form
          } 50%)`,
          opacity: label ? 1 : 0,
        }}
      >
        {props.label}
      </Box>
      <OutlinedInput
        className={clsx(props.classes && props.classes)}
        classes={{
          focused: styles['input-outlined-focused'],
          root: styles['input-outlined'],
        }}
        defaultValue={props.defaultValue && props.defaultValue}
        disabled={props.disabled}
        minRows={props.multiline && props.multiline}
        multiline={props.multiline ? true : false}
        placeholder={props.placeholder}
        sx={{
          fontSize: 14,
          height: props.fullHeight ? '100%' : undefined,
          padding: 0,
        }}
        onChange={(event) =>
          props.onChange && props.onChange(event.target.value)
        }
        onFocus={() => setLabel(props.label)}
        {...props.register}
        onBlur={() => setLabel(undefined)}
      />
    </Box>
  );
};

export default memo(Input);
