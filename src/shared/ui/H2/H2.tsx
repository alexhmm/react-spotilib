import { memo, ReactNode } from 'react';
import clsx from 'clsx';

// Styles
import styles from './H2.module.scss';

type H2Props = {
  children: ReactNode;
  classes?: string;
};

const H2 = (props: H2Props) => {
  return (
    <h2 className={clsx(styles['h2'], props.classes && props.classes)}>
      {props.children}
    </h2>
  );
};

export default memo(H2);
