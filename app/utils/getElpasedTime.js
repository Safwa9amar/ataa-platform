import dayjs from "dayjs";

const getElapsedTime = (createdAt) => {
  const now = dayjs();
  const createdDate = dayjs(createdAt);

  const hoursElapsed = now.diff(createdDate, "hour");
  const minutesElapsed = now.diff(createdDate, "minute");
  const secondsElapsed = now.diff(createdDate, "second");
  if (secondsElapsed < 60) {
    return `${secondsElapsed} ثانية مضت على اخر عملية تبرع`;
  } else if (hoursElapsed < 1) {
    return `${minutesElapsed} دقيقة مضت على اخر عملية تبرع`;
  } else if (hoursElapsed < 24) {
    return `${hoursElapsed} ساعة مضت على اخر عملية تبرع`;
  } else {
    return ` اخر عملية تبرع منذ :  ${createdDate.format("YYYY-MM-DD")}`;
  }
};

export default getElapsedTime;
