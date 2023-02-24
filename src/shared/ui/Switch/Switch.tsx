import { Switch as MuiSwitch } from '@mui/material';
import { ChangeEvent, memo } from 'react';

type SwitchProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
};

const Switch = (props: SwitchProps) => {
  return (
    <MuiSwitch
      checked={props.checked}
      onChange={(event: ChangeEvent<HTMLInputElement>, checked: boolean) =>
        props.onChange(checked)
      }
    />
  );
};

export default memo(Switch);
