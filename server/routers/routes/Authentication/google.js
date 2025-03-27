const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { PrismaClient } = require("@prisma/client");
const getTrialEndDate = require("../../../utils/getTrialEndDate");
const router = express.Router();
const prisma = new PrismaClient();
const secretKey = process.env.SECRET_KEY;
const googleClient = new OAuth2Client(process.env.WEB_CLIENT_ID);

// Middleware to validate the request body
const validateToken = (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  next();
};

// Route for Google authentication
router.all("/google", validateToken, async (req, res) => {
  const { token, saveLogin } = req.body;

  try {
    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      // audience: "163869725297-oml4h3tl1mopnvp3rkd8knn7de7qaga3.apps.googleusercontent.com", // Ensure the token is intended for your app
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    // Check if user exists in the database
    let user = await prisma.users.findUnique({
      where: { email },
    });

    // If user doesn't exist, create a new user
    if (!user) {
      try {
        user = await prisma.users.create({
          data: {
            googleId: sub,
            email,
            name,
            phone: null,
            role: "donor",
            isVerified: true,
            registrationStatus: "VERIFIED",
            trialEndDate: getTrialEndDate(15),
          },
        });

        // Send welcome email
        const welcomeEmail = {
          from: process.env.SMTP_USER,
          to: email,
          subject: "مرحبا بك في منصة عطاء",
          html: `
            <div dir="rtl" style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <p>عزيزي ${name}</p>
              <p>نحن سعداء بإنضمامك إلى عائلة "عطاء". لقد بدأت رحلتك في التغيير. الآن يمكنك إستكشاف فرص التبرع والمساهمة في إحداث فرق حقيقي في حياة الآخرين.</p>
              <p>
                ما الذي يمكنك فعله الآن؟
                <br/>
                <strong>اكتشاف المشاريع:</strong> استعرض مختلف مشاريعنا الإنسانية واختر المشروع الذي ترغب في دعمه.
                <br/>
                <strong>متابعة تقدمك:</strong> تابع أثر تبرعاتك من خلال لوحة التحكم الخاصة بك.
                <br/>
                <strong>مشاركة الخير:</strong> ادعُ أصدقاءك وعائلتك للانضمام إلينا والمشاركة في دعم المحتاجين.
                <br/>
                نحن هنا لمساعدتك في أي وقت. لا تتردد في التواصل معنا إذا كنت بحاجة إلى أي دعم أو استفسار.
                أطيب التحيات،
                فريق عطاء
              </p>
            </div>
          `,
        };

        req.app.locals.transporter.sendMail(welcomeEmail, (error, info) => {
          if (error) {
            console.error("Error sending welcome email:", error);
            return res
              .status(500)
              .json({ message: "حدث خطأ أثناء إرسال اميل الترحيب" });
          }
        });
      } catch (error) {
        console.error("Error creating user:", error);
        return res
          .status(500)
          .json({ message: "حدث خطأ أثناء إنشاء المستخدم" });
      }
    }

    // Generate JWT token
    const jwtToken = jwt.sign({ email: user.email }, secretKey, {
      expiresIn: saveLogin ? "30d" : "7d", // Save for 1 month if saveLogin is true, otherwise 7 days
    });

    // Return the JWT token
    res.status(200).json({ token: jwtToken });
  } catch (error) {
    console.error("Error during Google authentication:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
});

module.exports = router;
