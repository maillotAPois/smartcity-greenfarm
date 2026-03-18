const START_YEAR = 2030;
const START_MONTH = 0; // January
const START_DAY = 1;
const MS_PER_HOUR = 3600000;

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const SEASONS = ["Winter", "Spring", "Summer", "Autumn"] as const;
export type Season = (typeof SEASONS)[number];

function getBaseDate(): Date {
  return new Date(START_YEAR, START_MONTH, START_DAY, 0, 0, 0, 0);
}

export function tickToDate(tick: number): Date {
  const base = getBaseDate();
  return new Date(base.getTime() + tick * MS_PER_HOUR);
}

export function formatDate(tick: number): string {
  const date = tickToDate(tick);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:00`;
}

export function getCurrentSeason(tick: number): Season {
  const date = tickToDate(tick);
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Autumn";
  return "Winter";
}

export function getDayOfWeek(tick: number): string {
  const date = tickToDate(tick);
  return DAYS_OF_WEEK[date.getDay()];
}
