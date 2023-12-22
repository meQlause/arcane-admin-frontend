export function truncateMiddle(s: string, max_length: number = 10): string {
  if (s.length <= max_length) {
    return s;
  }

  const prefix_length: number = Math.floor((max_length - 3) / 2);
  const suffix_length: number = max_length - 3 - prefix_length;

  const prefix: string = s.slice(0, prefix_length);
  const suffix: string = s.slice(-suffix_length);

  return `${prefix}...${suffix}`;
}