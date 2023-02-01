import { memo, ReactNode } from 'react';
import clsx from 'clsx';

// Styles
import styles from './H3.module.scss';

// Types
import { MenuItem as IMenuItem } from '../../types/shared.types';
import { SpotifyTopTimeRange } from '../../types/spotify.types';

// UI
import Menu from '../Menu/Menu';

type H3Props = {
  children: ReactNode;
  classes?: string;
  menuItems?: IMenuItem<SpotifyTopTimeRange>[];
  menuTitle?: string;
  onMenuAction?: (action: any) => void;
};

const H3 = (props: H3Props) => {
  return (
    <div className={clsx(styles['h3'], props.classes && props.classes)}>
      <h3> {props.children}</h3>
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
  );
};

export default memo(H3);
