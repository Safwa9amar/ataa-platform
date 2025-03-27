const service = require("./service");

async function controller(req, res) {
  try {
    const donation = await service(req.body);
    res.status(201).json(donation);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = controller;
