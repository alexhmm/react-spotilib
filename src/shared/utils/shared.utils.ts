/**
 * Concat current and new data arrays.
 * @param currentData Current data array
 * @param newData New data array
 * @returns Concat array
 */
export const concatArray = <T>(currentData: T[], newData: T[]): T[] => {
  return [...currentData].concat(newData);
};

/**
 * GET Minutes and seconds by milliseconds with two digits.
 * @param ms Milliseconds
 * @returns Minutes and seconds with two digits.
 */
export const minutesSecondsByMillisecondsGet = (ms: number): string => {
  const add2Digits = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.round((ms % 60000) / 1000);

  return seconds === 60
    ? `${minutes + 1}:00`
    : `${minutes}:${add2Digits(seconds)}`;
};

/**
 * Set HTML page title.
 * @param subtitle Subtitle
 */
export const setTitle = (subtitle?: string) => {
  if (subtitle) {
    document.title = `${subtitle} • Spotilib`;
  } else {
    document.title = 'Spotilib';
  }
};
