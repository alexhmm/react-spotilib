import { memo, ReactNode } from 'react';

// Styles
import styles from './H2.module.scss';

type H2Props = {
  children: ReactNode;
};

const H2 = (props: H2Props) => {
  return <h2 className={styles['h2']}>{props.children}</h2>;
};

export default memo(H2);
