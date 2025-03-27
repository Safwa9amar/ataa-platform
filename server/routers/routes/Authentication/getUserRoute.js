const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// الحصول على قائمة المستخدمين
router.get("/users-list", async (req, res) => {
  try {
    // استخدام Prisma للحصول على جميع المستخدمين
    const users = await prisma.users.findMany();
    // الاستجابة بالبيانات المسترجعة
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error getting users:", error);
    res
      .status(500)
      .json({ error: "حدث خطأ ما يرجى تحديث الصفحة وإعادة المحاولة" });
  }
});

// الحصول على مستخدم بواسطة معرفه
router.get("/users-list/:id", async (req, res) => {
  try {
    // استخدام Prisma للحصول على المستخدم
    const user = await prisma.users.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    // الاستجابة بالبيانات المسترجعة
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting user:", error);
    res
      .status(500)
      .json({ error: "حدث خطأ ما يرجى تحديث الصفحة وإعادة المحاولة" });
  }
});

module.exports = router;
