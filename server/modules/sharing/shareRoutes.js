const express = require("express");
const router = express.Router();
const shareController = require("./shareController");

// إنشاء رابط مشاركة جديد
router.post("/share", shareController.createShare);
router.get("/share/:uniqueLink", shareController.getShareById);

// تتبع التبرعات من خلال الرابط
router.post("/donate", shareController.trackDonation);

// استبدال النقاط برصيد تبرع
router.post("/redeem-points", shareController.redeemPoints);

module.exports = router;
