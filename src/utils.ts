export function formatDateTime(date: Date) {
  return `${formatDate(date)}T${formatTime(date)}`;
}

export function formatTime(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function pad(x: number) {
  return x.toString().padStart(2, "0");
}
/**
 * ICS files can either be created with a VTIMEZONE-block which is ridiculous to generate.
 * To keep this program small, we do not hard code all available timezones and just use UTC and let the client handle the rest
 */
export function formatIcsDateTime(date: Date) {
  return `${formatIcsDate(date)}T${formatIcsTime(date)}Z`;
}

export function formatIcsDate(date: Date) {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
}

export function formatIcsTime(date: Date) {
  return `${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`;
}
