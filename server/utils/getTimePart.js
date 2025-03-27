function getTimePart(date, period) {
  const hour = date.getHours();
  const day = date.getDate();
  const weekDay = date.getDay();
  const month = date.getMonth();

  if (period === "daily") {
    if (hour >= 0 && hour < 8) return 1; // الصباح الباكر
    if (hour >= 8 && hour < 16) return 2; // فترة الظهيرة
    return 3; // المساء
  }

  if (period === "weekly") {
    if (weekDay >= 0 && weekDay < 3) return 1; // الأيام الأولى
    if (weekDay >= 3 && weekDay < 5) return 2; // منتصف الأسبوع
    return 3; // نهاية الأسبوع
  }

  if (period === "monthly") {
    if (day <= 10) return 1; // أول 10 أيام
    if (day <= 20) return 2; // من 11 إلى 20
    return 3; // من 21 إلى نهاية الشهر
  }

  if (period === "quarterly") {
    const quarter = Math.floor(month / 3) + 1; // تقسيم السنة إلى 4 أرباع
    return quarter;
  }

  return 0;
}
const generateColorMap = (periods) => {
  const colorMap = {};

  // General Color Palette
  const GENERAL_COLORS = [
    { light: "#3b82f6", dark: "#60a5fa" }, // Blue
    { light: "#10b981", dark: "#34d399" }, // Green
    { light: "#f59e0b", dark: "#fbbf24" }, // Amber
    { light: "#ef4444", dark: "#f87171" }, // Red
    { light: "#8b5cf6", dark: "#a78bfa" }, // Violet
  ];

  // Assign colors sequentially to all periods
  periods.forEach((period, index) => {
    colorMap[period] = GENERAL_COLORS[index % GENERAL_COLORS.length];
  });

  return colorMap;
};
// 2. Date Formatting Helper
const formatDate = (date, periodType) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  switch (periodType) {
    case "daily":
      return `${year}-${month}-${day}`;
    case "weekly": {
      const oneJan = new Date(year, 0, 1);
      const weekNumber = Math.ceil(
        ((d - oneJan) / 86400000 + oneJan.getDay() + 1) / 7
      );
      return `${year}-W${String(weekNumber).padStart(2, "0")}`;
    }
    case "monthly":
      return `${year}-${month}`;
    case "quarterly":
      return `${year}-Q${Math.ceil((d.getMonth() + 1) / 3)}`;
    case "yearly":
      return `${year}`;
    default:
      return "unknown-period";
  }
};

module.exports = { getTimePart, generateColorMap, formatDate };
