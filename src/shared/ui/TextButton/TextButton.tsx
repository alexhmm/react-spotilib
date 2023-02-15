import { memo, ReactNode } from 'react';
import { Button } from '@mui/material';

// Styles
import styles from './TextButton.module.scss';

// Types;
import { ColorType } from '../../types/mui.types';
import { ButtonType } from '../../types/ui.types';

type TextButtonProps = {
  children: ReactNode;
  preset?: ButtonType;
  onClick: () => void;
};

const TextButton = (props: TextButtonProps) => {
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
      color={color}
      className={styles['text-button']}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
};

export default memo(TextButton);
