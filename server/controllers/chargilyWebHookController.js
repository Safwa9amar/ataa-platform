const { verifySignature } = require("@chargily/chargily-pay");
const {
  chargilyWebHookServices,
} = require("../services/chargilyWebHookServices");

async function chargilyWebHookController(req, res) {
  try {
    const signature = req.get("signature");
    const payload = req.rawBody;

    if (!signature) {
      console.error("Missing signature header in the request.");
      return res.status(400).json({ error: "Signature header is required." });
    }

    if (!process.env.CHARGILY_API_KEY) {
      console.error(
        "CHARGILY_API_KEY is not set in the environment variables."
      );
      return res.status(500).json({ error: "Server configuration error." });
    }

    if (!payload) {
      console.error("Request payload is missing.");
      return res.status(400).json({ error: "Request payload is required." });
    }

    const isValidSignature = verifySignature(
      payload,
      signature,
      process.env.CHARGILY_API_KEY
    );

    if (!isValidSignature) {
      console.warn("Invalid signature detected.");
      return res.status(403).json({ error: "Invalid signature." });
    }

    const event = req.body;
    const io = req.io; // Retrieve io instance from the app object
    const chargilyClient = req.chargilyClient;

    if (!event || typeof event !== "object") {
      console.error("Invalid event data in the request body.");
      return res.status(400).json({ error: "Invalid event data." });
    }

    await chargilyWebHookServices(event, chargilyClient);
    //subscripe
    io.emit("subscripe");
    console.log("Webhook processed successfully.");
    res.sendStatus(200);
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = {
  chargilyWebHookController,
};
