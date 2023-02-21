import { memo, useEffect } from 'react';

// Stores
import useSharedStore from '../../../../shared/stores/use-shared.store';

const Playlists = () => {
  // Shared sotre state
  const [setPathName] = useSharedStore((state) => [state.setPathname]);

  /**
   * Set pathname on mount.
   */
  useEffect(() => {
    setPathName('/library/playlists');
    return () => {
      setPathName(undefined);
    };
    // eslint-disable-next-line
  }, []);

  return <div>Playlists</div>;
};

export default memo(Playlists);
