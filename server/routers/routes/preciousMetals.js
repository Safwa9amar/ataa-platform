const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express();

router.get("/silver-prices", async (req, res) => {
  // console.log("Fetching silver prices...");
  try {
    const { data } = await axios.get(
      "https://algeriagoldprice.com/silverprice/"
    );
    const $ = cheerio.load(data);

    const tableData = [];
    const date = $(".divTable:nth-child(4) .divTableHead:nth-child(2)")
      .text()
      .trim();

    $(".divTable:nth-child(4) .divTableBody .divTableRow").each(
      (index, element) => {
        if (index > 1) {
          // Skip the first two rows as they are headers
          const cells = $(element).find(".divTableCell");
          if (cells.length === 3) {
            const unit = getNumbersFromString($(cells[0]).text().trim());
            const priceInDZD = $(cells[1]).text().trim();
            const priceInUSD = $(cells[2]).text().trim();
            if (unit === "") return;
            tableData.push({ unit, priceInDZD, priceInUSD });
          }
        }
      }
    );

    res.json({
      date,
      prices: tableData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while scraping the data.");
  }
});
router.get("/gold-prices", async (req, res) => {
  // console.log("Fetching silver prices...");
  try {
    const { data } = await axios.get("https://algeriagoldprice.com/");
    const $ = cheerio.load(data);

    const tableData = [];
    const date = $(".divTable:nth-child(4) .divTableHead:nth-child(2)")
      .text()
      .trim();

    $(".divTable:nth-child(4) .divTableBody .divTableRow").each(
      (index, element) => {
        if (index > 1) {
          // Skip the first two rows as they are headers
          const cells = $(element).find(".divTableCell");
          if (cells.length === 3) {
            const unit = getNumbersFromString($(cells[0]).text().trim());
            const priceInDZD = $(cells[1]).text().replace(/,/g, "").trim();
            const priceInUSD = $(cells[2]).text().trim();
            if (unit === "") return;
            tableData.push({ unit, priceInDZD, priceInUSD });
          }
        }
      }
    );

    res.json({
      date,
      prices: tableData.reverse(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while scraping the data.");
  }
});
function getNumbersFromString(str) {
  // Match all digits in the string
  const numbers = str.match(/\d+/g);
  // Join the matched numbers into a single string
  return numbers ? numbers.join("") : "";
}


module.exports = router;
