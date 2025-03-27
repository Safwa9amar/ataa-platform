const shareService = require("./shareService");

// إنشاء رابط مشاركة جديد
const createShare = async (req, res) => {
  try {
    const { userId, platform, itemId, type } = req.body;
    const sharedLink = await shareService.createShareLink(
      userId,
      itemId,
      platform,
      type
    );
    res.status(201).json(sharedLink);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getShareById = async (req, res) => {
  try {
    const { uniqueLink } = req.params;
    const sharedLink = await shareService.getShareById(uniqueLink);
    res.status(201).json(sharedLink);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// تتبع التبرعات الناتجة عن رابط المشاركة
const trackDonation = async (req, res) => {
  try {
    const { sharedLinkId, amount } = req.body;
    const result = await shareService.trackDonation(sharedLinkId, amount);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//استبدال النقاط بالرصيد
const redeemPoints = async (userId, points) => {
  if (!userId || points <= 0) throw new Error("Invalid request");

  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (!user || user.redeemableAmbassadorPoints < points)
    throw new Error("Insufficient points");

  await prisma.users.update({
    where: { id: userId },
    data: {
      currentBalance: { increment: points },
      redeemableAmbassadorPoints: { decrement: points },
    },
  });
};
module.exports = { createShare, trackDonation, redeemPoints, getShareById };
