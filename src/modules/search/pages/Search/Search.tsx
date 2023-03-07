import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Styles
import styles from './Search.module.scss';

// Utils
import { setTitle } from '../../../../shared/utils/shared.utils';

const Search = () => {
  const { t } = useTranslation();

  // ####### //
  // EFFECTS //
  // ####### //

  /**
   * Set page title on mount.
   */
  useEffect(() => {
    setTitle(t('search.title').toString());
    return () => {
      setTitle();
    };
    // eslint-disable-next-line
  }, []);

  return <div className={styles['search']}>{t('search.text')}</div>;
};

export default memo(Search);
