import { memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Check if browser can restorate scroll (scroll to top on navigate)
  useEffect(() => {
    const canControlScrollRestoration = 'scrollRestoration' in window.history;
    if (canControlScrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  return <></>;
};

export default memo(ScrollToTop);
