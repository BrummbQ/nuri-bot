export function daysAgo(days = 7): Date {
  const now = new Date();
  const timeAgo = new Date();
  timeAgo.setDate(now.getDate() - days);
  return timeAgo;
}

export function lastSunday(): Date {
  const dayOfWeek = new Date().getDay();
  const lastSundayDate = new Date();
  lastSundayDate.setDate(lastSundayDate.getDate() - dayOfWeek);
  lastSundayDate.setHours(0, 0, 0, 0); // Set to start of day
  return lastSundayDate;
}
