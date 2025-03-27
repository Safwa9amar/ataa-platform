const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const secretKey = process.env.SECRET_KEY;
const validator = require("validator");
const getTrialEndDate = require("../../../utils/getTrialEndDate");

// Verify user with code and set password
router.post("/verify-sign-up", async (req, res) => {
  const { email, verificationCode, password, rememberMe, role } = req.body;

  // التحقق من طول كلمة المرور
  if (!validator.isLength(password, { min: 8 })) {
    return res
      .status(400)
      .json({ message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل" });
  }

  if (!email || !verificationCode || !password) {
    return res.status(400).json({
      message: "الرجاء إدخال البريد الإلكتروني، كود التحقق، وكلمة المرور",
    });
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    if (user.verificationCode === verificationCode) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.users.update({
        where: {
          email: email,
        },
        data: {
          isVerified: true,
          verificationCode: null,
          password: hashedPassword,
          registrationStatus: "VERIFIED",
          trialEndDate: getTrialEndDate(15),
          role: role ? role : null,
        },
      });

      // return res with token
      const token = jwt.sign({ email }, secretKey, {
        expiresIn: rememberMe ? "7d" : "1h",
      });
      return res.status(200).json({
        token,
        message: "تم التحقق من المستخدم بنجاح وتعيين كلمة المرور",
      });
    } else {
      return res.status(400).json({ message: "كود التحقق غير صحيح" });
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "حدث خطأ أثناء التحقق من كود التحقق" });
  }
});

module.exports = router;
