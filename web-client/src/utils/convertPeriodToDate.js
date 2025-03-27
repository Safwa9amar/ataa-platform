import dayjs from "dayjs";

// Convert selected period to a date
const convertPeriodToDate = (period) => {
  switch (period) {
    case "اليوم":
      return dayjs().startOf("day").toDate();
    case "الأسبوع":
      return dayjs().startOf("week").toDate();
    case "الشهر":
      return dayjs().startOf("month").toDate();
    case "السنة":
      return dayjs().startOf("year").toDate();
    case "كل الأوقات":
    default:
      return null; // For "كل الأوقات", you might return null or an indicative value
  }
};

export default convertPeriodToDate;
