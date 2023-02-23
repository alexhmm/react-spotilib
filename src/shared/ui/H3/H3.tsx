import { memo, ReactNode } from 'react';
import clsx from 'clsx';

// Styles
import styles from './H3.module.scss';

// Types
import { MenuItem as IMenuItem } from '../../types/shared.types';
import { SpotifyTopTimeRange } from '../../types/spotify.types';

// UI
import Menu from '../Menu/Menu';
import TextButton from '../TextButton/TextButton';

type H3Props = {
  actionTitle?: string;
  children: ReactNode;
  classes?: string;
  menuItems?: IMenuItem<SpotifyTopTimeRange>[];
  menuTitle?: string;
  onAction?: () => void;
  onMenuAction?: (action: any) => void;
};

const H3 = (props: H3Props) => {
  return (
    <div className={clsx(styles['h3'], props.classes && props.classes)}>
      <div className={styles['h3-title']}>
        <h3>{props.children}</h3>
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
    </div>
  );
};

export default memo(H3);
