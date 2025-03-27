const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

// Reset password
router.post("/reset-password", async (req, res) => {
  console.log("POST /reset-password", req.method, req.body);
  const { email, verificationCode, password, rememberMe } = req.body;

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "البريد الإلكتروني غير صالح" });
  }

  // Validate password length
  if (!validator.isLength(password, { min: 8 })) {
    return res
      .status(400)
      .json({ message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل" });
  }

  try {
    // Find user by email and reset token
    const user = await prisma.users.findFirst({
      where: {
        email: email,
        resetToken: verificationCode,
        resetTokenExpiry: {
          gte: new Date().toISOString(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "رمز إعادة تعيين كلمة المرور غير صحيح أو منتهي الصلاحية",
        action: "resend",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        registrationStatus:
          user.registrationStatus === "CREATED"
            ? "VERIFIED"
            : user.registrationStatus,
      },
    });

    // Return success message
    const token = jwt.sign({ email }, secretKey, {
      expiresIn: rememberMe ? "7d" : "1h",
    });

    res.status(200).json({ token, message: "تم تغيير كلمة المرور بنجاح" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "حدث خطأ أثناء إعادة تعيين كلمة المرور" });
  }
});

module.exports = router;
