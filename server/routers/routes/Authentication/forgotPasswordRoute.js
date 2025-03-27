const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const randomatic = require("randomatic");
const validator = require("validator");
const path = require("path");

// Generate a random 6-digit numeric code
const generateToken = () => {
  return randomatic("0", 6);
};

// Send password reset email
router.post("/forgot-password", async (req, res) => {
  console.log("Forgot password request received");
  const { email } = req.body;

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "البريد الإلكتروني غير صالح" });
  }

  try {
    // Check if user exists in the database
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    // Generate and save token
    const token = generateToken();

    await prisma.users.update({
      where: {
        email: email,
      },
      data: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 3600000), // Token expires in 1 hour
      },
    });
    // get logo from uploads folder
    // Send password reset email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "طلب إعادة تعيين كلمة المرور لحسابك على منصة عطاء",
      html: `
        <div
        dir="rtl"
      style="
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #f9f9f9;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      "
    >
      <img
        src="https://ataa-platform.com/images/200/10033520/fullLogo.png"
        alt="Ataa Logo"
        style="max-width: 200px; margin: 0 auto 20px; display: block"
      />
      <p>عزيزي المستخدم،</p>
      <p>
       لقد تلقينا طلبًا لإعادة تعيين كلمة المرور لحسابك على منصة "عطاء". إذا كنت قد طلبت هذا الإجراء، يُرجى اتباع الخطوات أدناه لإعادة تعيين كلمة المرور الخاصة بك. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة أو التواصل معنا فورًا.
      </p>
      <p style="font-size: 32px; font-weight: bold; color: #d9534f; margin: 10px 0">
       كود التحقق: ${token}
      </p>
      <strong>خطوات إعادة تعيين كلمة المرور :</strong>
      <ol>
        <li>انقر على زر [إستعادة] في التطبيق أو أنقر على الرابط  التالي لإعادة تعيين كلمة المرور: [رابط إعادة التعيين]</li>
        <li>سيتم توجيهك إلى صفحة إعادة تعيين كلمة المرور أدخل بريدك الإلكتروني المرتبط بالحساب ثم أنقر على زر [إستعادة]</li>
        <li>تأكد من وصول كود التحقق المكون من 6 أرقام إلى بريدك الإلكتروني ثم قم بإدخاله في الحقل المخصص له.</li>
        <li>قم بإعادة تعيين كلمة المرور الجديدة الخاصة بك في الحقول المخصصة، وتأكد من أنها قوية وآمنة.</li>
        <li>أنقر على زر [إستعادة] لإتمام عملية إعادة التعيين.</li>
        </ol>
      <br />
      <p>
        إذا واجهت أي صعوبات أو كانت لديك أي استفسارات، لا تتردد في التواصل معنا عبر البريد الإلكتروني ${process.env.SUPPORT_EMAIL} وسنكون سعداء بمساعدتك.
      </p>
      <p>
        نحن هنا لدعمك في أي وقت ونحرص على تأمين حسابك وحماية معلوماتك الشخصية.
      </p>
      <br />
      <p>مع تحيات،</p>
      <p>فريق الدعم</p>
      <p>عطاء</p>
      <div
        style="
          margin-top: 20px;
          font-size: 12px;
          color: #777;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        "
      >
        <p>© 2024 عطاء. جميع الحقوق محفوظة.</p>
      </div>
    </div>
    `,
    };

    req.app.locals.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          message:
            "حدث خطأ أثناء إرسال رمز إعادة تعيين كلمة المرور عبر البريد الإلكتروني",
        });
      } else {
        console.log("Email sent:", info.response);
        res.status(200).json({
          message: "تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
        });
      }
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res
      .status(500)
      .json({ message: "حدث خطأ أثناء معالجة طلب إعادة تعيين كلمة المرور" });
  }
});

module.exports = router;
