import { useEffect } from 'react';

/**
 * Hook to wait until action has finished after an delay to execute an asynchronous effect.
 * @param effect Function
 * @param dependencies Dependencies
 * @param delay Delay (ms)
 */
export const useDebouncedEffect = (
  effect: Function,
  dependencies: any[],
  delay: number
) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(dependencies || []), delay]);
};
