import { memo, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';
import { Box, Button } from '@mui/material';

// Hooks
import useShared from '../../hooks/use-shared.hook';

// Styles
import styles from './Tabs.module.scss';

// UI
import Icon from '../../ui/Icon/Icon';

type TabItemProps = {
  active?: boolean;
  icon: [IconPrefix, IconName];
  children: ReactNode;
  to: string;
};

const TabItem = (props: TabItemProps) => {
  const navigate = useNavigate();

  return (
    <div className={styles['tab-item']}>
      <Button
        className={styles['tab-item-button']}
        color="inherit"
        onClick={() => navigate(props.to)}
      >
        <Icon
          icon={props.icon}
          sx={{ color: props.active ? 'text.primary' : 'text.secondary' }}
        />
        <Box
          className={styles['tab-item-title']}
          sx={{ color: props.active ? 'text.primary' : 'text.secondary' }}
        >
          {props.children}
        </Box>
      </Button>
    </div>
  );
};

const Tabs = () => {
  const { pathname } = useLocation();
  const { tabItemsGet } = useShared();

  return (
    <Box className={styles['tabs']} sx={{ backgroundColor: 'bg.sidebar' }}>
      {tabItemsGet().map((tabItem) => (
        <TabItem
          key={tabItem.pathname}
          active={pathname === tabItem.pathname}
          icon={tabItem.icon}
          to={tabItem.pathname}
        >
          {tabItem.title}
        </TabItem>
      ))}
    </Box>
  );
};

export default memo(Tabs);
