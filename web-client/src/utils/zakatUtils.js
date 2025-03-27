// src/utils/zakatUtils.js

// Mapping of gold caliber to purity percentage
const goldPurity = {
  10: 37.5,
  12: 50,
  14: 58.5,
  16: 66.7,
  18: 75,
  20: 83.3,
  21: 87.5,
  22: 91.7,
  24: 99.9,
};

// Mapping of silver purity to percentage
const silverPurity = {
  800: 80,
  880: 88,
  900: 90,
  925: 92.5,
  958: 95.8,
  999: 99,
};

// Conversion factors to grams
const unitToGramConversion = {
  gram: 1,
  kilogram: 1000,
  ounce: 28.3495,
};

/**
 * Convert weight to grams based on unit.
 * @param {number} weight - The weight of the metal.
 * @param {string} unit - The unit of the weight (gram, kilogram, ounce).
 * @returns {number} - The weight in grams.
 */
const convertWeightToGrams = (weight, unit) => {
  const conversionFactor = unitToGramConversion[unit];

  if (!conversionFactor) {
    throw new Error("Invalid weight unit provided.");
  }

  return weight * conversionFactor;
};

/**
 * Calculate net weight of gold for Zakat purposes based on purity percentage.
 * @param {number} weight - The weight of the gold.
 * @param {number} caliber - The caliber of the gold.
 * @param {string} unit - The unit of the weight (gram, kilogram, ounce).
 * @returns {number} - The net weight of the gold.
 */
const calculateZakatNetWeightGold = (weight, caliber, unit = 'gram') => {
  const weightInGrams = convertWeightToGrams(weight, unit);
  const purityPercentage = goldPurity[caliber];

  if (!purityPercentage) {
    throw new Error("Invalid gold caliber provided.");
  }

  const netWeight = (purityPercentage / 100) * weightInGrams;
  return netWeight;
};

/**
 * Calculate net weight of silver for Zakat purposes based on purity percentage.
 * @param {number} weight - The weight of the silver.
 * @param {number} caliber - The caliber of the silver.
 * @param {string} unit - The unit of the weight (gram, kilogram, ounce).
 * @returns {number} - The net weight of the silver.
 */
const calculateZakatNetWeightSilver = (weight, caliber, unit = 'gram') => {
  const weightInGrams = convertWeightToGrams(weight, unit);
  const purityPercentage = silverPurity[caliber];

  if (!purityPercentage) {
    throw new Error("Invalid silver caliber provided.");
  }

  const netWeight = (purityPercentage / 100) * weightInGrams;
  return netWeight;
};

/**
 * Calculate the Zakat value based on net weight of metal and metal price per gram.
 * @param {number} netWeight - The net weight of the metal.
 * @param {number} gramPrice - The price per gram of the metal.
 * @returns {number} - The calculated Zakat value.
 */
const calculateZakatValue = (netWeight, gramPrice) => {
  const zakatRate = 2.5 / 100;
  const zakatValue = netWeight * gramPrice * zakatRate;
  return zakatValue;
};

export { calculateZakatNetWeightGold, calculateZakatNetWeightSilver, calculateZakatValue };
