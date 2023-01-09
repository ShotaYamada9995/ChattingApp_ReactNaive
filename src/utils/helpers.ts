/** Convert duration to mm:ss format
 * @param _duration time in seconds
 */
export const mmssTimeFormat = (_duration: number): string => {
  const duration = Number(_duration.toFixed(1));

  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration - minutes * 60);

  const _minutes = `${minutes}`.padStart(2, '0');
  const _seconds = `${seconds}`.padStart(2, '0');

  return `${_minutes}:${_seconds}`;
};

/** Convert duration to hh:mm:ss format
 * @param _duration time in seconds
 */
export const hhmmssTimeFormat = (_duration: number): string => {
  const duration = Number(_duration.toFixed(1));

  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration - minutes * 60);

  const _minutes = `${minutes}`.padStart(2, '0');
  const _seconds = `${seconds}`.padStart(2, '0');

  return `00:${_minutes}:${_seconds}`;
};

export const formatNumber = (n: number): string | number | undefined => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K';
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M';
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B';
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T';
};
