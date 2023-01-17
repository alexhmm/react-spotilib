import { memo, ReactNode } from 'react';
import clsx from 'clsx';

// Styles
import styles from './H3.module.scss';

type H3Props = {
  children: ReactNode;
  classes?: string;
};

const H3 = (props: H3Props) => {
  return (
    <h3 className={clsx(styles['h3'], props.classes && props.classes)}>
      {props.children}
    </h3>
  );
};

export default memo(H3);
