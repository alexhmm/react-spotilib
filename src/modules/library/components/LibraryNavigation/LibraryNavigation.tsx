import { memo, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Hooks
import useBreakpoints from '../../../../shared/hooks/use-breakpoints.hook';
import useShared from '../../../../shared/hooks/use-shared.hook';

// Styles
import styles from './LibraryNavigation.module.scss';

// Types
import { ButtonType } from '../../../../shared/types/ui.types';

// UI
import TextButtonContained from '../../../../shared/ui/TextButtonContained/TextButtonContained';

type LibraryNavigationButtonProps = {
  active?: boolean;
  children: ReactNode;
  onClick: () => void;
};

const LibraryNavigationItem = (props: LibraryNavigationButtonProps) => {
  return (
    <TextButtonContained
      classes={styles['library-navigation-item']}
      preset={props.active ? ButtonType.Selected : undefined}
      onClick={() => props.onClick()}
    >
      {props.children}
    </TextButtonContained>
  );
};

const LibraryNavigation = () => {
  const { lgDown } = useBreakpoints();
  const location = useLocation();
  const navigate = useNavigate();
  const { libraryNavigationItemsGet } = useShared();

  return (
    <Box
      className={styles['library-navigation']}
      sx={{ backgroundColor: lgDown ? 'background.default' : undefined }}
    >
      {libraryNavigationItemsGet().map((libraryNavigationItem) => (
        <LibraryNavigationItem
          key={libraryNavigationItem.pathname}
          active={location.pathname === libraryNavigationItem.pathname}
          onClick={() => navigate(libraryNavigationItem.pathname)}
        >
          {libraryNavigationItem.title}
        </LibraryNavigationItem>
      ))}
    </Box>
  );
};

export default memo(LibraryNavigation);
