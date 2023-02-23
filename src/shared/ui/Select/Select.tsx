import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from '@mui/material';
import { memo } from 'react';

// Types
import { FormItem } from '../../types/shared.types';

type SelectProps = {
  items: FormItem[];
  label?: string;
  value: any;
  onChange: (value: any) => void;
};

const Select = (props: SelectProps) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      {props.label && <InputLabel>{props.label}</InputLabel>}
      <MuiSelect
        value={props.value}
        label={props.label}
        onChange={(event) => props.onChange(event.target.value)}
      >
        {/* <MenuItem value="">
        <em>None</em>
      </MenuItem> */}
        {props.items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.title}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};

export default memo(Select);
