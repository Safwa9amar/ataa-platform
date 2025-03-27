const moment = require("moment");

/**
 * Get the trial end date based on the current date and the selected period in days.
 * @param {number} periodInDays - The number of days for the trial period.
 * @returns {Date} - The calculated trial end date.
 */
function getTrialEndDate(periodInDays) {
  if (typeof periodInDays !== "number" || periodInDays <= 0) {
    throw new Error("Invalid period: The period must be a positive number.");
  }

  // Calculate the end date
  const trialEndDate = moment().add(periodInDays, "days").endOf("day").toDate();
  return trialEndDate;
}

// Example usage:
try {
  const trialPeriodInDays = 15; // Example: 15 days trial
  const trialEndDate = getTrialEndDate(trialPeriodInDays);
  console.log("Trial End Date:", trialEndDate);
} catch (error) {
  console.error("Error calculating trial end date:", error.message);
}

module.exports = getTrialEndDate;
