const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const authenticate = require("../../../middlewares/authMiddleware");
const upload = require("../../../middlewares/uploadImageMiddleware");
const prisma = new PrismaClient();
const secretKey = process.env.SECRET_KEY;

// تحديث بيانات المستخدم
router.put(
  "/update-user",
  authenticate,
  upload.single("photo"),
  async (req, res) => {
    const token = req.headers.authorization;
    const { name, password, confirmPassword, phone, isVisible } = req.body;
    // check if password and confirm password match
    if (password !== confirmPassword) { 
      return res
        .status(400)
        .json({ message: "كلمة المرور وتأكيدها يجب أن تتطابق" });
    }
    // التحقق من صحة وجود التوكن
    if (!token) {
      return res.status(401).json({ message: "يرجى اعادة تسجيل الدخول" });
    }

    try {
      // فك ترميز التوكن للحصول على معرّف المستخدم
      const decoded = jwt.verify(token, secretKey);
      const email = decoded.email;

      // Initialize the data object
      const data = {};
      if (name) data.name = name;
      data.isVisible = isVisible === "true" ? true : false;
      if (phone) data.phone = phone;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        data.password = hashedPassword;
      }

      if (req.file && req.file.filename) data.photo = req.file.filename;
      // todo add image to the user
      await prisma.image.create({
        data: { ...req.file },
      });
      // استخدام Prisma لتحديث بيانات المستخدم
      const user = await prisma.users.update({
        where: {
          email: email,
        },
        data: data,
      });

      // الاستجابة بالبيانات المحدثة
      res.status(200).json({ user });
    } catch (error) {
      console.error("Error updating user:", error.message);
      res
        .status(500)
        .json({ error: "حدث خطأ ما يرجى تحديث الصفحة وإعادة المحاولة" });
    }
  }
);

module.exports = router;
