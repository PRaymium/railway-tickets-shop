export default function getFormattedDate(date: Date): string {
  const hours = date.getHours();
  const hoursStr = ('0' + hours).slice(-2);
  const minutes = date.getMinutes();
  const minutesStr = ('0' + minutes).slice(-2);

  return `${hoursStr}:${minutesStr} - ${date.toLocaleDateString()}`;
}
