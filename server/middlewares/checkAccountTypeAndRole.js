const prisma = require("../models/index");

const checkAccountTypeAndRole = async (req, res, next) => {
  const userId = req.user?.id; // Assuming `req.user` is populated by authentication middleware
  const userRole = req.user?.role; // Assuming role is also provided in the token or user object
  try {
    // Map roles to corresponding account types
    const roleToAccountType = {
      charity: "charityId",
      donor: "donorId", // Example: Adjust if you have a donor relation
      blood_agency: "bloodAgencyId", // Example: Adjust if you have a blood agency relation
      partner: "partnerId", // Example: Adjust if you have a partner relation
    };

    if (userRole === "undefined") {
      next();
    }
    const accountField = roleToAccountType[userRole];

    // Check if the user already has the corresponding account type
    const existingAccount = await prisma.users.findFirst({
      where: {
        id: userId,
        role: { not: null },
      },
    });
    if (existingAccount) {
      console.log(
        `You already have an account of type '${userRole}'. You cannot create another account type.`
      );
      return res.status(400).json({
        message: `You already have an account of type '${userRole}'. You cannot create another account type.`,
      });
    }
    // If no account exists, allow the request to proceed
    next();
  } catch (error) {
    console.error(
      "Error in checkAccountTypeAndRole middleware:",
      error.message
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = checkAccountTypeAndRole;
