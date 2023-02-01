import { memo, PropsWithChildren, useCallback, useState } from 'react';
import { Box, Button, Popover as MuiPopover } from '@mui/material';
import clsx from 'clsx';

// Styles
import styles from './Menu.module.scss';

// Types
import { MenuItem as IMenuItem } from '../../types/shared.types';

type MenuItemProps = {
  classes?: string;
  title: string;
  onClick: () => void;
};

const MenuItem = (props: MenuItemProps) => {
  return (
    <Button
      className={clsx(styles['menu-item'], props.classes && props.classes)}
      color="inherit"
      onClick={props.onClick}
    >
      {props.title}
    </Button>
  );
};

type MenuProps<T> = {
  items: IMenuItem<T>[];
  title: string;
  onAction: (action: T) => void;
};

// const Menu = (props: MenuProps) => {
const Menu = <ObjectType,>(props: PropsWithChildren<MenuProps<ObjectType>>) => {
  // Component state
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);

  /**
   * Handler to close menu.
   */
  const onMenuClose = useCallback(() => {
    setAnchorMenu(null);
  }, []);

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={Boolean(anchorMenu) ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorMenu) ? 'true' : undefined}
        className={styles['menu']}
        onClick={(event) => setAnchorMenu(event.currentTarget)}
      >
        {props.title}
      </Button>
      <MuiPopover
        anchorEl={anchorMenu}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        classes={{
          paper: styles['menu-popover-paper'],
          root: styles['menu-popover'],
        }}
        open={Boolean(anchorMenu)}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        onClose={() => setAnchorMenu(null)}
      >
        <Box
          className={styles['menu-popover-content']}
          sx={{ backgroundColor: 'background.paper' }}
        >
          {props.items.map((item, index) => (
            <MenuItem
              key={index}
              title={item.title}
              onClick={() => {
                onMenuClose();
                props.onAction && props.onAction(item.action);
              }}
            />
          ))}
        </Box>
      </MuiPopover>
    </>
  );
};

export default memo(Menu);
