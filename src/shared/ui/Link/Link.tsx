import { ElementType, memo, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box } from '@mui/material';
import clsx from 'clsx';

// Styles
import styles from './Link.module.scss';

type LinkProps = {
  children?: ReactNode;
  component?: ElementType<any>;
  classes?: string;
  to: string;
  onClick?: () => void;
};

const Link = (props: LinkProps) => {
  return (
    <Box
      component={props.component ?? 'span'}
      sx={{
        '.app-link:hover': {
          color: 'primary.main',
        },
      }}
      onClick={() => props.onClick && props.onClick}
    >
      <RouterLink
        className={clsx(
          styles['link'],
          props.classes && props.classes,
          'app-link'
        )}
        to={props.to}
      >
        {props.children && props.children}
      </RouterLink>
    </Box>
  );
};

export default memo(Link);
