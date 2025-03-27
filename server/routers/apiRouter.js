// src/routes/apiRouter.js
const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken");
const prisma = require("../models/index");
const apiRouter = express.Router();
exports.apiRouter = apiRouter;
const secretKey = process.env.SECRET_KEY;

const routers = require("./index.routers");
const multer = require("multer");

// Define additional routes
apiRouter.get("/check_auth", authenticate, async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.headers.authorization, secretKey);

    const user = await prisma.users.findUnique({
      where: { email: decodedToken.email },
      include: {
        ambassadorPoints: true,
        sharedLinks: true,
        zakat: true,
        subscriptions: {
          include: {
            plan: true,
          },
        },
        recharges: true,
        charity: true,
        bloodAgency: true,
        partners: true,
        notifications: true,
        testimonial: true,
        address: true,
        donations: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            donationOpportunity: {
              include: {
                progress: true,
              },
            },
            campaign: {
              include: {
                progress: true,
              },
            },
          },
        },
      },
    });

    if (user) {
      delete user.password;
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error checking auth:", error);
    res.status(401).json({ message: "Unauthorized", error });
  }
});

// Error handler for multer
apiRouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).send({ message: err.message });
  }
  if (err) {
    console.error("multer error", err);
    return res.status(400).send({ message: err.message });
  }
  next();
});
apiRouter.get("/", async (req, res) => {
  console.log("GET /status => checking server status", req.method);
  try {
    await prisma.$connect();
    res.status(200).json({ message: "Server is running" });
  } catch (error) {
    res.status(500).json({ message: "Server is down", error });
  }
});

routers.forEach((router) => {
  apiRouter.use(router);
});

module.exports = apiRouter;
