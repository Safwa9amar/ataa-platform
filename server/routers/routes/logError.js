const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");

const router = express();

const prisma = new PrismaClient();

// Middleware to parse JSON request bodiesF

// Endpoint to receive error logs from the client
router.post("/log-error", async (req, res) => {
  console.log("Received error log from client");
  const { message, stack, additionalInfo } = req.body;

  try {
    await prisma.errorLog.create({
      data: {
        message,
        stack,
        additionalInfo, // Optional: any other data you want to store
      },
    });

    console.log("Client error logged to database");
    res.status(200).json({ message: "Error logged successfully" });
  } catch (error) {
    console.error("Error saving log to database:", error);
    res.status(500).json({ message: "Failed to log error" });
  }
});

module.exports = router;
