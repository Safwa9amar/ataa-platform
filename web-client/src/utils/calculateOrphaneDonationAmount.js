function calculateSponsorshipAmount(
  period,
  duration,
  reverse = false,
  monthlyAmount = 10000
) {
  let dailyAmount = monthlyAmount / 30; // Approximate daily amount
  let weeklyAmount = dailyAmount * 7; // Weekly amount
  let yearlyAmount = monthlyAmount * 12; // Yearly amount

  let amount = 0;

  switch (period) {
    case "يوم":
      amount = dailyAmount * duration;
      break;
    case "اسبوع":
      amount = weeklyAmount * duration;
      break;
    case "شهر":
      amount = monthlyAmount * duration;
      break;
    case "السنة":
      amount = yearlyAmount * duration;
      break;
    default:
      throw new Error("Invalid period selected");
  }

  return amount;
}
function reverseCalculateSponsorshipAmount(amount, monthlyAmount = 10000) {
  let dailyAmount = monthlyAmount / 30;
  let weeklyAmount = dailyAmount * 7;
  let yearlyAmount = monthlyAmount * 12;

  let period = "";
  let duration = 0;

  if (Math.round(amount % yearlyAmount) === 0) {
    period = "سنة";
    duration = amount / yearlyAmount;
  } else if (Math.round(amount % monthlyAmount) === 0) {
    period = "شهر";
    duration = amount / monthlyAmount;
  } else if (Math.round(amount % weeklyAmount) === 0) {
    period = "اسبوع";
    duration = amount / weeklyAmount;
  } else if (Math.round(amount % dailyAmount) === 0) {
    period = "يوم";
    duration = amount / dailyAmount;
  } else {
    period = "يوم";
    duration = amount / dailyAmount;
  }

  return { period, duration: duration.toFixed(0) };
}

export default calculateSponsorshipAmount;
export { reverseCalculateSponsorshipAmount };
