const { PrismaClient } = require("@prisma/client");
const express = require("express");
const authenticate = require("../../middlewares/authMiddleware");

const prisma = new PrismaClient();
const router = express.Router();

/**
 * تحويل نقاط سفراء العطاء القابلة للاسترداد إلى رصيد مالي
 * @param {string} userId معرف المستخدم
 * @param {number} [conversionRate=0.1] معدل التحويل (مثلاً، كل 10 نقاط = 1 دولار)
 */
async function convertAmbassadorPointsToBalance(userId, conversionRate = 1) {
  try {
    // جلب جميع نقاط السفير الخاصة بالمستخدم
    const ambassadorPoints = await prisma.ambassadorPoints.findMany({
      where: { userId },
      select: {
        id: true,
        totalPoints: true,
      },
    });

    if (!ambassadorPoints || ambassadorPoints.length === 0) {
      throw new Error("لا توجد نقاط قابلة للاستبدال");
    }

    // حساب إجمالي النقاط القابلة للتحويل
    const totalPoints = ambassadorPoints.reduce(
      (sum, point) => sum + point.totalPoints,
      0
    );
    if (totalPoints <= 0) {
      throw new Error("لا توجد نقاط كافية للتحويل");
    }

    // جلب بيانات المستخدم
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        currentBalance: true,
      },
    });

    if (!user) {
      throw new Error("المستخدم غير موجود");
    }

    // حساب المبلغ بناءً على إجمالي النقاط
    const amountToAdd = totalPoints;

    // تحديث بيانات المستخدم وتصغير جميع النقاط إلى صفر بعد التحويل
    await prisma.$transaction([
      prisma.users.update({
        where: { id: userId },
        data: {
          currentBalance: user.currentBalance + amountToAdd,
        },
      }),
      ...ambassadorPoints.map((point) =>
        prisma.ambassadorPoints.update({
          where: { id: point.id },
          data: { totalPoints: 0, redeemablePoints: point.totalPoints }, // تصفير النقاط لكل سجل
        })
      ),
    ]);

    return {
      success: true,
      message: `تم تحويل ${totalPoints} نقطة إلى ${amountToAdd} رصيد.`,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// إنشاء مسار API لتحويل النقاط إلى رصيد
router.post("/convert-ambasador-points", authenticate, async (req, res) => {
  const userId = req.user.id;

  const result = await convertAmbassadorPointsToBalance(userId);
  res.json(result);
});

module.exports = router;
