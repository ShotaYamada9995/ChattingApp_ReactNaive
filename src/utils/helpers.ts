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
