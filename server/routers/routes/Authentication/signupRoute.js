const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const randomatic = require("randomatic");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const validator = require("validator");
const logger = require("../../../utils/logger");

// تحديد معدل الطلبات لنقطة تسجيل الدخول
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 5, // حد أقصى 5 طلبات لكل عنوان IP في الفترة الزمنية
  message:
    "عدد كبير جدًا من محاولات التسجيل من هذا العنوان، يرجى المحاولة مرة أخرى لاحقًا",
});

// وسيط التحقق من صحة المدخلات
const validateSignup = [
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("رقم الهاتف مطلوب")
    .isMobilePhone()
    .withMessage("صيغة رقم الهاتف غير صالحة"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("الاسم مطلوب")
    .isLength({ min: 2 })
    .withMessage("يجب أن يكون الاسم مكونًا من حرفين على الأقل"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("البريد الإلكتروني مطلوب")
    .isEmail()
    .withMessage("بريد إلكتروني غير صالح"),
];

/**
 * @route POST /auth/signup
 * @desc تسجيل مستخدم جديد
 * @access عام
 */
router.post("/signup", signupLimiter, validateSignup, async (req, res) => {
  try {
    logger.info("تم استلام طلب POST /auth/signup", { metadata: req.body });

    // التحقق من صحة بيانات الطلب
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("أخطاء في التحقق أثناء التسجيل", { errors: errors.array() });
      return res.status(400).json({
        message: "أخطاء في التحقق",
        errors: errors.array(),
      });
    }

    const { phone, name, email, address } = req.body;

    // التحقق من وجود المستخدم (باستخدام معاملة للاتساق)
    const [userExists, phoneExists] = await prisma.$transaction([
      prisma.users.findUnique({ where: { email } }),
      prisma.users.findUnique({ where: { phone } }),
    ]);

    if (userExists) {
      logger.warn("محاولة تسجيل باستخدام بريد إلكتروني موجود", { email });
      return res.status(409).json({
        message:
          "البريد الإلكتروني مسجل بالفعل. إذا كنت مسجلاً مسبقًا، يرجى إعادة تعيين كلمة المرور",
        errorCode: "EMAIL_EXISTS",
      });
    }

    if (phoneExists) {
      logger.warn("محاولة تسجيل باستخدام رقم هاتف موجود", { phone });
      return res.status(409).json({
        message: "رقم الهاتف مسجل بالفعل",
        errorCode: "PHONE_EXISTS",
      });
    }

    // إنشاء كود التحقق مع تاريخ انتهاء الصلاحية
    const verificationCode = randomatic("0", 6);
    const verificationCodeExpires = new Date(Date.now() + 30 * 60 * 1000); // انتهاء الصلاحية بعد 30 دقيقة

    // إنشاء مستخدم مع معاملة لضمان اتساق البيانات
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.users.create({
        data: {
          name,
          phone,
          email,
          verificationCode,
          address: address ? { create: address } : undefined,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
        },
      });

      return newUser;
    });

    logger.info("تم إنشاء المستخدم بنجاح", { userId: user.id });

    // تحضير رسائل البريد الإلكتروني
    const emailTemplates = {
      verification: {
        subject: "تأكيد حسابك على منصة عطاء",
        template: verificationEmailTemplate(name, verificationCode),
      },
      welcome: {
        subject: "مرحباً بك في منصة عطاء",
        template: welcomeEmailTemplate(name),
      },
    };

    // إرسال رسائل البريد الإلكتروني بشكل متوازي
    const emailPromises = [
      sendEmail(
        email,
        emailTemplates.verification.subject,
        emailTemplates.verification.template,
        req
      ),
      sendEmail(
        email,
        emailTemplates.welcome.subject,
        emailTemplates.welcome.template,
        req
      ),
    ];

    await Promise.all(emailPromises)
      .then(() =>
        logger.info("تم إرسال رسائل التحقق والترحيب", { userId: user.id })
      )
      .catch((err) => {
        logger.error("فشل في إرسال البريد الإلكتروني", {
          error: err.message,
          userId: user.id,
        });
        // عدم إفشال الطلب في حال فشل الإرسال، فقط تسجيل الخطأ
      });

    // الرد بنجاح (بدون تضمين بيانات حساسة)
    return res.status(201).json({
      success: true,
      message:
        "تم التسجيل بنجاح. يرجى التحقق من بريدك الإلكتروني للحصول على كود التحقق",
      data: {
        userId: user.id,
        emailSent: true,
      },
    });
  } catch (error) {
    console.log(error);

    logger.error("خطأ في التسجيل", {
      error: error.message,
      stack: error.stack,
      endpoint: "/auth/signup",
    });

    return res.status(500).json({
      success: false,
      message: "حدث خطأ غير متوقع أثناء التسجيل",
      errorCode: "SERVER_ERROR",
    });
  }
});

// دوال قوالب البريد الإلكتروني
function verificationEmailTemplate(name, verificationCode) {
  return `
    <div dir="rtl" style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <p>عزيزي ${name}</p>
      <p>لقد أتممت الخطوة الأولى لتسجيلك في منصة "عطاء". نحن سعداء بانضمامك إلى مجتمعنا المتنامي.</p>
      <p>لتفعيل حسابك وتأمينه، يُرجى إدخال كود التحقق التالي في التطبيق:</p>
      <p style="font-size: 32px; font-weight: bold; color: #d9534f; margin: 10px 0">كود التحقق: ${verificationCode}</p>
      <p>إذا لم تقم بطلب هذا الكود، يرجى التواصل معنا فورًا عبر البريد الإلكتروني ${
        process.env.SUPPORT_EMAIL
      }</p>
      <p>أطيب التحيات،<br/>فريق عطاء</p>
      <div style="margin-top: 20px; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 10px;">
        <p>© ${new Date().getFullYear()} عطاء. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  `;
}

function welcomeEmailTemplate(name) {
  return `
    <div dir="rtl" style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <p>عزيزي ${name}</p>
      <p>نحن سعداء بإنضمامك إلى عائلة "عطاء". لقد بدأت رحلتك في التغيير.</p>
      <p>ما الذي يمكنك فعله الآن؟</p>
      <ul>
        <li><strong>اكتشاف المشاريع:</strong> استعرض مختلف مشاريعنا الإنسانية</li>
        <li><strong>متابعة تقدمك:</strong> تابع أثر تبرعاتك</li>
        <li><strong>مشاركة الخير:</strong> ادعُ أصدقاءك للانضمام إلينا</li>
      </ul>
      <p>أطيب التحيات،<br/>فريق عطاء</p>
      <div style="margin-top: 20px; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 10px;">
        <p>© ${new Date().getFullYear()} عطاء. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  `;
}

// مساعد إرسال البريد الإلكتروني
async function sendEmail(to, subject, html, req) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: `"عطاء" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    req.app.locals.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}

module.exports = router;
