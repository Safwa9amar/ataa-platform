import dayjs from "dayjs";

const useElapsedTime = (createdAt) => {
  const now = dayjs();
  const createdDate = dayjs(createdAt);
  const secondsElapsed = now.diff(createdDate, "second");
  const hoursElapsed = now.diff(createdDate, "hour");
  const minutesElapsed = now.diff(createdDate, "minute");
  const daysElapsed = now.diff(createdDate, "day");
  const weeksElapsed = now.diff(createdDate, "week");
  const monthsElapsed = now.diff(createdDate, "month");
  const yearsElapsed = now.diff(createdDate, "year");

  let customText;
  if (minutesElapsed < 1) {
    customText = `${secondsElapsed} ثانية`;
  } else if (hoursElapsed < 1) {
    customText = `${minutesElapsed} دقائق`;
  } else if (hoursElapsed < 24) {
    customText = `${hoursElapsed} ساعات`;
  } else if (daysElapsed < 7) {
    customText = `${daysElapsed} يوم`;
  } else if (weeksElapsed < 4) {
    customText = `${weeksElapsed} اسبوع`;
  } else if (monthsElapsed < 12) {
    customText = `${monthsElapsed} شهر`;
  } else if (yearsElapsed >= 1) {
    customText = `${yearsElapsed}  سنة`;
  } else {
    customText = `اخر عملية تبرع : ${createdDate.format("YYYY-MM-DD")}`;
  }

  return {
    hoursElapsed,
    minutesElapsed,
    daysElapsed,
    weeksElapsed,
    monthsElapsed,
    yearsElapsed,
    customText,
  };
};

export default useElapsedTime;
