const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const secretKey = process.env.SECRET_KEY;
const validator = require("validator");

// تسجيل الدخول
router.all("/login", async (req, res) => {
  const { email, password, rememberMe } = req.body;
  console.log("POST /login", req.body);
  console.log("POST /login", req.body);
  // التحقق من تعبئة البريد الإلكتروني وكلمة المرور
  if (!email) {
    return res.status(400).json({ message: "الرجاء إدخال البريد الإلكتروني" });
  }
  if (!password) {
    return res.status(400).json({ message: "الرجاء إدخال كلمة السر" });
  }

  // التحقق من صحة تنسيق البريد الإلكتروني
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "البريد الإلكتروني غير صحيح" });
  }

  // التحقق من طول كلمة المرور
  if (!validator.isLength(password, { min: 8 })) {
    return res
      .status(400)
      .json({ message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل" });
  }

  try {
    // التحقق من وجود المستخدم في قاعدة البيانات
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    // إذا لم يكن المستخدم موجودًا، قم بإرجاع خطأ
    if (!user) {
      return res
        .status(401)
        .json({ message: "خطأ في البريد الإلكتروني أو كلمة المرور" });
    }

    // تحقق مما إذا كان الحساب غير مُفعّل
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "الحساب غير مُفعّل. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب." });
    }

    // التحقق من صحة كلمة المرور
    if(user.password === null) {
      console.log("User password is null");
      
      return res
        .status(401)
        .json({ message:"كلمة المرور غير صالحة يرجى تغييرها \n انتقل الى صفحة استعادة كلمة السر حنى تتمكن من تغييرها" });
    }
    const passwordMatch =  await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "خطأ في البريد الإلكتروني أو كلمة المرور" });
    }

    // إنشاء رمز JWT
    const token = jwt.sign({ email }, secretKey, {
      expiresIn: rememberMe ? "7d" : "1h",
    });

    // إعادة الرمز إلى العميل
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "حدث خطأ أثناء معالجة طلب تسجيل الدخول" });
  }
});

module.exports = router;
