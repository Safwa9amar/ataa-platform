const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cron = require("node-cron");

const cleanupUnverifiedAccounts = async () => {
  const oneHourAgo = new Date(Date.now() - 3600000); // 1 hour in milliseconds

  try {
    const result = await prisma.users.deleteMany({
      where: {
        isVerified: false,
        createdAt: {
          lt: oneHourAgo,
        },
      },
    });

    console.log(`Deleted ${result.count} unverified accounts.`);
  } catch (error) {
    console.error("Error cleaning up unverified accounts:", error);
  }
};

// Schedule the job to run every 15 minutes
cron.schedule("*/15 * * * *", cleanupUnverifiedAccounts);

module.exports = cleanupUnverifiedAccounts;
