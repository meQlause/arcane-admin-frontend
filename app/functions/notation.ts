export function formatNumber(num: number): string {
  const absNum = Math.abs(num);

  if (absNum >= 1e6) {
    return (absNum / 1e6).toFixed(1) + 'M';
  } else if (absNum >= 1e3) {
    return (absNum / 1e3).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
}