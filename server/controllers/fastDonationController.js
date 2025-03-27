const fastDonationServices = require("../services/fastDonationServices");

async function chargily(req, res) {
  const client = req.chargilyClient;
  const { field, amount } = req.params;
  try {
    let checkout = await fastDonationServices.chargily(client, field, amount);
    res.status(200).json(checkout);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error whilte donate using chargily" });
  }
}
async function ccp(req, res) {}

async function baridimob(req, res) {
  const data = req.body;
  try {
    let checkout = await fastDonationServices.baridimob(data);
    res.status(200).json(checkout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function stripe(req, res) {
  const { field, amount } = req.params;
  try {
    let checkout = await fastDonationServices.stripe(field, amount);
    res.status(200).json(checkout);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error whilte donate using chargily" });
  }
}

module.exports = {
  chargily,
  stripe,
  ccp,
  baridimob,
};
