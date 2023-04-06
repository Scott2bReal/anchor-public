import type { CampWeek } from "@prisma/client";

const onlyMonthAndDay = (date: Date, forBot?: boolean) => {
  const month = date.getMonth() + 1;
  const day = forBot ? date.getDate() : date.getDate() + 1;

  return `${month}/${day}`;
};

export const formatCampWeekDates = (campWeek: CampWeek, forBot?: boolean) => {
  if (forBot) {
    return `${onlyMonthAndDay(campWeek.startDate, forBot)} - ${onlyMonthAndDay(
      campWeek.endDate,
      forBot
    )}`;
  }
  return `${onlyMonthAndDay(campWeek.startDate)} - ${onlyMonthAndDay(
    campWeek.endDate
  )}`;
};
