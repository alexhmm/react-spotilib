import { memo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Styles
import styles from './H3.module.scss';

// Types
import { MenuItem as IMenuItem } from '../../types/shared.types';

// UI
import Menu from '../Menu/Menu';
import TextButton from '../TextButton/TextButton';

type H3Props = {
  actionTitle?: string;
  children: ReactNode;
  classes?: string;
  link?: string;
  menuItems?: IMenuItem[];
  menuTitle?: string;
  onAction?: () => void;
  onMenuAction?: (action: any) => void;
};

const H3 = (props: H3Props) => {
  return (
    <Box
      className={clsx(styles['h3'], props.classes && props.classes)}
      sx={{
        '.app-link:hover': {
          color: 'primary.main',
        },
      }}
    >
      <div className={styles['h3-title']}>
        {props.link ? (
          <Link className="app-link transition-colors" to={props.link}>
            <h3>{props.children}</h3>
          </Link>
        ) : (
          <h3>{props.children}</h3>
        )}
        {props.menuItems && props.menuTitle && (
          <Menu
            items={props.menuItems}
            title={props.menuTitle}
            onAction={(action) =>
              props.onMenuAction && props.onMenuAction(action)
            }
          />
        )}
      </div>
      <div className={styles['h3-action']}>
        {props.actionTitle && props.onAction && (
          <TextButton onClick={props.onAction}>{props.actionTitle}</TextButton>
        )}
      </div>
    </Box>
  );
};

export default memo(H3);
