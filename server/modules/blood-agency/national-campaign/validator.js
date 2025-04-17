const { body } = require("express-validator");

exports.nationalCampaignCreateValidator = [
  // الخطوة 1: معلومات عامة
  body("title")
    .notEmpty()
    .withMessage("عنوان الحملة مطلوب"),
  body("description")
    .notEmpty()
    .withMessage("يرجى إدخال وصف تفصيلي للحملة"),
  body("overview")
    .notEmpty()
    .withMessage("يرجى تقديم نظرة عامة عن الحملة"),
  body("wilaya")
    .notEmpty()
    .withMessage("الولاية مطلوبة"),
  body("daira")
    .notEmpty()
    .withMessage("الدائرة مطلوبة"),
  body("commune")
    .notEmpty()
    .withMessage("البلدية مطلوبة"),
  body("start_date")
    .notEmpty()
    .withMessage("تاريخ بداية الحملة مطلوب")
    .isISO8601()
    .withMessage("صيغة التاريخ غير صحيحة"),
  body("end_date")
    .notEmpty()
    .withMessage("تاريخ نهاية الحملة مطلوب")
    .isISO8601()
    .withMessage("صيغة التاريخ غير صحيحة"),

  // الخطوة 2: تفاصيل الشاحنات والموقع
  body("truckCount")
    .isInt({ min: 0 })
    .withMessage("عدد الشاحنات يجب أن يكون رقمًا صحيحًا 0 أو أكثر"),
  body("truckLocations")
    .isArray()
    .withMessage("قائمة مواقع الشاحنات مطلوبة")
    .custom((value) => value.length > 0)
    .withMessage("يجب تحديد موقع واحد على الأقل لكل شاحنة"),

  // الخطوة 3: معلومات إضافية
  body("donationType")
    .notEmpty()
    .withMessage("نوع التبرع المطلوب مطلوب"),
  body("targetGroups")
    .isArray()
    .withMessage("الفئة المستهدفة يجب أن تكون قائمة")
    .custom((value) => value.length > 0)
    .withMessage("يجب تحديد فئة مستهدفة واحدة على الأقل"),

  // الخطوة 4: الصور
  body("images")
    .isArray()
    .withMessage("قائمة صور الحملة مطلوبة")
    .custom((value) => value.length > 0)
    .withMessage("يرجى تحميل صورة واحدة على الأقل للحملة"),


];
