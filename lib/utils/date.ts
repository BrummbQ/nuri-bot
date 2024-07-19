export function daysAgo(days = 7): Date {
  const now = new Date();
  const timeAgo = new Date();
  timeAgo.setDate(now.getDate() - days);
  return timeAgo;
}
