export function formatDateTime(date: Date) {
  return `${formatDate(date)}T${formatTime(date)}`;
}

export function formatTime(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatDate(date: Date){
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function pad(x: number) {
  return x.toString().padStart(2, "0");
}