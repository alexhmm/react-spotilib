import { memo, useEffect } from 'react';

// Stores
import useSharedStore from '../../../../shared/stores/use-shared.store';

const Artists = () => {
  // Shared sotre state
  const [setPathName] = useSharedStore((state) => [state.setPathname]);

  /**
   * Set pathname on mount.
   */
  useEffect(() => {
    setPathName('/library/artists');
    return () => {
      setPathName(undefined);
    };
    // eslint-disable-next-line
  }, []);

  return <div>Artists</div>;
};

export default memo(Artists);
