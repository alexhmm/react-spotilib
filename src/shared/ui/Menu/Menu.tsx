import { memo, useCallback, useState } from 'react';
import { IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  Button,
  Popover as MuiPopover,
  PopoverOrigin,
  SxProps,
  Theme,
  Tooltip,
} from '@mui/material';
import clsx from 'clsx';

// Styles
import styles from './Menu.module.scss';

// Types
import { ColorType, FontSize } from '../../types/mui.types';
import { MenuItem as IMenuItem } from '../../types/shared.types';

// UI
import IconButton from '../IconButton/IconButton';

type MenuItemProps = {
  classes?: string;
  hideIcon?: boolean;
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

type MenuProps = {
  anchorOrigin?: PopoverOrigin;
  classes?: string;
  color?: ColorType;
  hideItemIcon?: boolean;
  icon?: [IconPrefix, IconName];
  iconSize?: FontSize;
  items: IMenuItem[];
  padding?: string | undefined;
  sx?: SxProps<Theme>;
  title?: string;
  tooltip?: string;
  transformOrigin?: PopoverOrigin;
  onAction: (action: any) => void;
};

const Menu = (props: MenuProps) => {
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
      {props.icon ? (
        <Tooltip placement="top" title={props.tooltip}>
          <IconButton
            classes={props.classes && props.classes}
            color={props.color}
            icon={props.icon}
            iconSize={props.iconSize}
            padding={props.padding}
            sx={{ ...props.sx }}
            onClick={(event) => setAnchorMenu(event.currentTarget)}
          />
        </Tooltip>
      ) : (
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
      )}
      <MuiPopover
        anchorEl={anchorMenu}
        anchorOrigin={
          props.anchorOrigin ?? { horizontal: 'right', vertical: 'bottom' }
        }
        classes={{
          paper: styles['menu-popover-paper'],
          root: styles['menu-popover'],
        }}
        open={Boolean(anchorMenu)}
        transformOrigin={
          props.transformOrigin ?? {
            horizontal: 'right',
            vertical: 'top',
          }
        }
        onClose={() => setAnchorMenu(null)}
      >
        <Box
          className={styles['menu-popover-content']}
          sx={{ backgroundColor: 'background.paper' }}
        >
          {props.items.map((item, index) => {
            if (!item.undefined) {
              return (
                <MenuItem
                  key={index}
                  hideIcon={props.hideItemIcon}
                  title={item.title}
                  onClick={() => {
                    onMenuClose();
                    props.onAction && props.onAction(item.action);
                  }}
                />
              );
            }
            return null;
          })}
        </Box>
      </MuiPopover>
    </>
  );
};

export default memo(Menu);
