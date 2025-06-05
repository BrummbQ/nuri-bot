export function getAppUrl(): string {
  if (process.env.NODE_ENV === "production") {
    return `https://nuribot.de`;
  } else {
    return `http://localhost:3000`;
  }
}
