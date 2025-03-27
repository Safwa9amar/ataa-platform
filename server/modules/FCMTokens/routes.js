const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Save or update FCM token
router.post("/save-fcm-token", async (req, res) => {
  const { userId, token } = req.body;

  if (!userId || !token) {
    return res.status(400).json({ error: "User ID and token are required" });
  }

  try {
    let user = await prisma.users.findUnique({
      where: { id: userId },
      include: { fcmTokens: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add the token if it's not already stored
    if (!user.fcmTokens.some((el) => el.token === token)) {
      await prisma.users.update({
        where: { id: userId },
        data: {
          fcmTokens: {
            create: {
              token: token,
            },
          },
        },
      });
    } else {
      console.log("mfc already saved for", user.id);
    }

    res.status(200).json({ message: "Token saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
