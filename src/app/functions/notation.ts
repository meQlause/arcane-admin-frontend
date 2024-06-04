export function formatNumber(num: number): string {
  const absNum = Math.abs(num);
  const formattedNum = (n: number) => n % 1 === 0 ? n.toFixed(0) : n.toFixed(1).replace(/\.0$/, '');

  if (absNum >= 1e6) {
    return formattedNum(absNum / 1e6) + 'M';
  } else if (absNum >= 1e3) {
    return formattedNum(absNum / 1e3) + 'K';
  } else {
    return num.toString();
  }
}