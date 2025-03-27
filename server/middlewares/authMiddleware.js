// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const prisma = require("../models/index");
const authenticate = async (req, res, next) => {
  const secretKey = process.env.SECRET_KEY;
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access denied." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    if (decoded)
      req.user = await prisma.users.findUnique({
        where: {
          email: decoded.email,
        },
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          registrationStatus: true,
        },
      });
    next();
  } catch (error) {
    console.error("Authentication middleware error", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticate;
