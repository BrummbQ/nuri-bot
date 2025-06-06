export function lastSunday(): Date {
  const dayOfWeek = new Date().getDay();
  const lastSundayDate = new Date();
  lastSundayDate.setDate(lastSundayDate.getDate() - dayOfWeek);
  lastSundayDate.setHours(0, 0, 0, 0); // Set to start of day
  return lastSundayDate;
}

export function formatDateShort(date: Date): string {
  const formatter = new Intl.DateTimeFormat("de-DE", {
    month: "numeric",
    day: "numeric",
  });

  return formatter.format(date);
}

export function formatDateLong(date: Date): string {
  const formatter = new Intl.DateTimeFormat("de-DE", {
    year: "2-digit",
    month: "short",
    day: "numeric",
  });

  return formatter.format(date);
}
