export function formatDate(inputDateTime: string): string {
  const now = new Date();
  const inputDate = new Date(inputDateTime);

  // Check if it's today
  if (
    inputDate.getDate() === now.getDate() &&
    inputDate.getMonth() === now.getMonth() &&
    inputDate.getFullYear() === now.getFullYear()
  ) {
    return 'Today';
  }

  // Check if it's yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (
    inputDate.getDate() === yesterday.getDate() &&
    inputDate.getMonth() === yesterday.getMonth() &&
    inputDate.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  }

  // Format as MMM DD, YYYY
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
    inputDate
  );

  return formattedDate;
}

export function formatTime(inputDateTime: string): string {
  const inputDate = new Date(inputDateTime);

  // Format as HH:mm AM/PM
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const formattedTime = new Intl.DateTimeFormat('en-US', options).format(
    inputDate
  );

  return formattedTime;
}