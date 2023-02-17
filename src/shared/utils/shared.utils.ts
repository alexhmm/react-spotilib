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
