import { memo } from 'react';

// Styles
import styles from './Notes.module.scss';

const Notes = () => {
  return <div className={styles['notes']}>Notes</div>;
};

export default memo(Notes);
