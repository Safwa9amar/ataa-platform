const Joi = require("joi");

// Validation schema for creating/updating a campaign
const normalCampaignSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "يرجى إدخال عنوان للحملة.",
    "any.required": "العنوان مطلوب.",
  }),
  createdByuserId: Joi.string().allow(null),
  // numberOfUnits
  numberOfUnits: Joi.number().allow(null, "").messages({
    "number.base": "عدد الوحدات يجب أن يكون رقماً صحيحاً.",
    "any.required": "يرجى إدخال عدد الوحدات.",
  }),

  // unitPrice
  unitPrice: Joi.number().allow(null, "").messages({
    "number.base": "سعر الوحدة يجب أن يكون رقماً صحيحاً.",
    "any.required": "يرجى إدخال سعر الوحدة.",
  }),
  description: Joi.string().allow(null, "").messages({
    "string.base": "يرجى إدخال وصف للحملة.",
  }),
  images: Joi.array().default([]).messages({
    "string.base": "الصور يجب أن تكون عبارة عن روابط نصية.",
  }),
  totalDonation: Joi.number().allow(null, "").messages({
    "number.base": "إجمالي التبرعات يجب أن يكون رقماً صحيحاً.",
  }),
  bankAccount: Joi.string().allow(null, "").messages({
    "string.base": "يرجى إدخال رقم حساب بنكي صحيح.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "يرجى إدخال بريد إلكتروني صحيح.",
    "any.required": "البريد الإلكتروني مطلوب.",
  }),
  name: Joi.string().required().messages({
    "string.empty": "يرجى إدخال اسمك.",
    "any.required": "الاسم مطلوب.",
  }),
  phone: Joi.string().required().messages({
    "string.empty": "يرجى إدخال رقم الهاتف.",
    "any.required": "رقم الهاتف مطلوب.",
  }),
  ownerAddress: Joi.string().allow(null, "").messages({
    "string.base": "يرجى إدخال عنوان المالك.",
  }),
  ownerEmail: Joi.string().email().allow(null, "").messages({
    "string.email": "يرجى إدخال بريد إلكتروني صحيح للمالك.",
  }),
  ownerPhone: Joi.string().allow(null, "").messages({
    "string.base": "يرجى إدخال رقم هاتف صحيح للمالك.",
  }),
  ownerID: Joi.string().allow(null, "").messages({
    "string.base": "يرجى إدخال رقم تعريف صحيح للمالك.",
  }),
  ownerName: Joi.string().allow(null, "").messages({
    "string.base": "يرجى إدخال اسم صحيح للمالك.",
  }),
  bloodBankName: Joi.string().allow(null, "").messages({
    "string.base": "يرجى إدخال اسم صحيح لبنك الدم.",
  }),
  selectedBloodType: Joi.string()
    .valid(
      "A_POSITIVE",
      "A_NEGATIVE",
      "B_POSITIVE",
      "B_NEGATIVE",
      "O_POSITIVE",
      "O_NEGATIVE",
      "AB_POSITIVE",
      "AB_NEGATIVE"
    )
    .allow(null, "")
    .messages({
      "any.only": "يرجى اختيار الزمرة المطلوبة من الخيارات المتاحة.",
    }),
  googleMapLink: Joi.string().allow(null, "").messages({
    "string.base": "رابط خرائط جوجل يجب أن يكون نصياً صحيحاً.",
  }),
  wilaya: Joi.number().allow(null, "").messages({
    "string.base": "يرجى إدخال ولاية.",
  }),
  commune: Joi.number().allow(null, "").messages({
    "string.base": "يرجى إدخال بلدية.",
  }),
  daira: Joi.string().allow(null, "").messages({
    "string.base": "يرجى إدخال دائرة.",
  }),
  proofFile: Joi.array().default("{}").messages({
    "string.base": "ملفات الإثبات يجب أن تكون نصية.",
  }),
  proofFiles: Joi.array().default([]).messages({
    "string.base": "يرجى إدخال ملفات إثبات صحيحة.",
  }),
  cardImage: Joi.string().messages({
    "string.empty": "يرجى تحميل صورة البطاقة.",
  }),

  numOfBeneficiaries: Joi.number().default(0).messages({
    "number.base": "يرجى إدخال عدد المستفيدين الصحيح.",
  }),
  targetAmount: Joi.number().default(0).messages({
    "number.base": "يرجى إدخال المبلغ المستهدف الصحيح.",
  }),
  fieldId: Joi.number().allow(null, "").messages({
    "number.base": "يرجى إدخال معرف مجال صحيح.",
    "any.required": "معرف المجال مطلوب.",
  }),
  categoryId: Joi.number().allow(null, "").messages({
    "number.base": "يرجى إدخال معرف فئة صحيح.",
  }),
  campaignStatus: Joi.string()
    .valid("ONGOING", "URGENT", "NOT_URGENT")
    .default("NOT_URGENT")
    .messages({
      "any.only": "يرجى اختيار حالة حملة صحيحة: جاري، عاجل، أو غير عاجل.",
    }),
  CampaignType: Joi.string()
    .valid("BLOOD", "MONEY", "GOODS")
    .default("MONEY")
    .messages({
      "any.only": "يرجى اختيار نوع حملة صحيح: دم، مال، أو بضائع.",
    }),
  isAgreed: Joi.boolean().allow(null, "").messages({
    "boolean.base": "يرجى الموافقة على الشروط.",
  }),
});
const ongoingCampaignSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "يرجى إدخال عنوان للحملة.",
    "any.required": "العنوان مطلوب.",
  }),
  createdByuserId: Joi.string().allow(null),
  // numberOfUnits

  description: Joi.string().allow(null, "").messages({
    "string.base": "يرجى إدخال وصف للحملة.",
  }),
  images: Joi.array().default([]).messages({
    "string.base": "الصور يجب أن تكون عبارة عن روابط نصية.",
  }),
  totalDonation: Joi.number().allow(null, "").messages({
    "number.base": "إجمالي التبرعات يجب أن يكون رقماً صحيحاً.",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "يرجى إدخال بريد إلكتروني صحيح.",
    "any.required": "البريد الإلكتروني مطلوب.",
  }),
  name: Joi.string().required().messages({
    "string.empty": "يرجى إدخال اسمك.",
    "any.required": "الاسم مطلوب.",
  }),
  phone: Joi.string().required().messages({
    "string.empty": "يرجى إدخال رقم الهاتف.",
    "any.required": "رقم الهاتف مطلوب.",
  }),

  wilaya: Joi.number().allow(null, "").messages({
    "string.base": "يرجى إدخال ولاية.",
  }),
  commune: Joi.number().allow(null, "").messages({
    "string.base": "يرجى إدخال بلدية.",
  }),
  daira: Joi.string().allow(null, "").messages({
    "string.base": "يرجى إدخال دائرة.",
  }),
  proofFile: Joi.array().default("{}").messages({
    "string.base": "ملفات الإثبات يجب أن تكون نصية.",
  }),
  proofFiles: Joi.array().default([]).messages({
    "string.base": "يرجى إدخال ملفات إثبات صحيحة.",
  }),
  fieldId: Joi.number().allow(null, "").messages({
    "number.base": "يرجى إدخال معرف مجال صحيح.",
    "any.required": "معرف المجال مطلوب.",
  }),
  categoryId: Joi.number().allow(null, "").messages({
    "number.base": "يرجى إدخال معرف فئة صحيح.",
  }),
  campaignStatus: Joi.string()
    .valid("ONGOING", "URGENT", "NOT_URGENT")
    .default("NOT_URGENT")
    .messages({
      "any.only": "يرجى اختيار حالة حملة صحيحة: جاري، عاجل، أو غير عاجل.",
    }),
  CampaignType: Joi.string()
    .valid("BLOOD", "MONEY", "GOODS")
    .default("MONEY")
    .messages({
      "any.only": "يرجى اختيار نوع حملة صحيح: دم، مال، أو بضائع.",
    }),
  isAgreed: Joi.boolean().allow(null, "").messages({
    "boolean.base": "يرجى الموافقة على الشروط.",
  }),
});
module.exports = {
  normalCampaignSchema,
  ongoingCampaignSchema,
};
