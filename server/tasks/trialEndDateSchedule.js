const cron = require("node-cron");
const moment = require("moment");
const prisma = require("../models/index");
const setupMailer = require("../utils/mailer");

async function handleTrialAccounts() {
  console.log("start check trial accounts");

  let mailer = setupMailer();
  try {
    const currentDate = moment().startOf("day").toDate();
    const reminderDate = moment().add(2, "days").startOf("day").toDate();

    // Find users whose trial ends in 2 days (to send reminders)
    const usersToRemind = await prisma.users.findMany({
      where: {
        trialEndDate: reminderDate,
        isActive: true, // Ensure only active accounts get reminders
      },
      select: {
        email: true,
        name: true,
        trialEndDate: true,
      },
    });
    // Send reminder emails
    if (usersToRemind.length) {
      usersToRemind.forEach((user) => {
        const remainingDays = moment(user.trialEndDate).diff(
          currentDate,
          "days"
        );
        const mailOptions = {
          from: process.env.SUPPORT_EMAIL,
          to: user.email,
          subject: "تذكير: انتهاء الفترة التجريبية",
          text: `مرحباً ${user.name}،\n\nنود تذكيرك بأن الفترة التجريبية لحسابك على منصة عطاء ستنتهي خلال ${remainingDays} يوم. للحصول على المزيد من الميزات، يرجى الاشتراك في أحد الباقات المتوفرة.\n\nشكراً لاستخدامكم منصة عطاء.`,
        };

        mailer.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(`Failed to send email to ${user.email}:`, error);
          } else {
            console.log(`Reminder email sent to ${user.email}:`, info.response);
          }
        });
      });
    }

    // Find users whose trial has expired and disable their accounts
    const expiredUsers = await prisma.users.findMany({
      where: {
        trialEndDate: { lte: currentDate },
        isActive: true, // Ensure only active accounts are disabled
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Update the account status to DISABLED for expired users
    if (expiredUsers.length) {
      const userIds = expiredUsers.map((user) => user.id);

      await prisma.users.updateMany({
        where: { id: { in: userIds } },
        data: { canCreateCampaign: false, isActive: false },
      });

      // Notify expired users
      expiredUsers.forEach((user) => {
        const mailOptions = {
          from: process.env.SUPPORT_EMAIL,
          to: user.email,
          subject: "انتهاء الفترة التجريبية",
          text: `مرحباً ${user.name}،\n\nنود إعلامك بأن الفترة التجريبية لحسابك على منصة عطاء قد انتهت. يمكنك إعادة تنشيط حسابك عبر الاشتراك في أحد الباقات المتوفرة.\n\nشكراً لاستخدامكم منصة عطاء.`,
        };

        mailer.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(`Failed to send email to ${user.email}:`, error);
          } else {
            console.log(
              `Account disabled email sent to ${user.email}:`,
              info.response
            );
          }
        });
      });
    }
  } catch (error) {
    console.error("Error handling trial accounts:", error);
  }
}

// Schedule the job to run daily at 8 AM
cron.schedule("* 8 * * *", handleTrialAccounts);

module.exports = handleTrialAccounts;
