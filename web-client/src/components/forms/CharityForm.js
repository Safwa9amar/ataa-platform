"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Input,
  Button,
  Typography,
  Alert,
  Textarea,
} from "@material-tailwind/react";
import CustomStepper from "@/components/layouts/CustomStepper";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import { MdUploadFile } from "react-icons/md";
import { motion } from "framer-motion";
import GoogleLoginComponent from "../layouts/GoogleLogin";
import validator from "validator";
import { createCharity } from "@/services/charityService";
import { useCredentials } from "@/context/CredentialsContext";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { FaInstagram, FaLinkedin } from "react-icons/fa6";
export default function CharityRegistrationPage() {
  const router = useRouter();
  const { user, userToken, checkAuthentication } = useCredentials();

  // Form state
  const [formData, setFormData] = useState({
    // Step 1
    legalName: "جمعية الخير الوطنية",
    commonName: "الخير للجميع",
    registrationNumber: "123456789",
    establishmentDate: "2005-08-15",
    registrationCountry: "الجزائر",
    organizationType: "منظمة غير ربحية",

    // Step 2
    contactPerson: "محمد عبد القادر",
    position: "مدير تنفيذي",
    address: {
      street: "شارع الثورة",
      city: "الجزائر العاصمة",
      state: "الجزائر",
      postalCode: "16000",
      country: "الجزائر",
    },

    // Step 3
    missionStatement: "نسعى لتقديم المساعدة الإنسانية للأسر المحتاجة والأيتام.",
    activitiesOverview: "برامج توفير الغذاء، دعم التعليم، والمساعدات الطبية.",
    targetedBeneficiaries: "الأسر الفقيرة، الأطفال الأيتام، المرضى.",
    activityAreas: "وطنية مع تركيز على المناطق الريفية.",

    // Step 4
    legalInfo: {
      registrationCertificate: "شهادة تسجيل الجمعية.pdf",
      financialReport: "التقرير المالي السنوي.pdf",
      fundingSource: "تبرعات الأفراد، منح حكومية، اشتراكات الأعضاء.",
      taxID: "789654123",
    },

    // Step 5
    bankDetails: {
      bankName: "بنك التنمية الوطني",
      accountNumber: "12345678901234",
      IBAN: "DZ1234567890123456789012",
      SWIFT: "BDNADZAL",
    },

    // Step 6
    additionalDocuments: {
      foundingContract: "عقد تأسيس الجمعية.pdf",
      boardMembers: "قائمة مجلس الإدارة.pdf",
      additionalCertificates: "شهادة اعتماد الجمعية.pdf",
    },

    // Step 7
    digitalPresence: {
      website: "https://www.khayer.org",
      facebook: "https://www.facebook.com/khayer",
      twitter: "https://www.twitter.com/khayer",
      linkedin: "https://www.linkedin.com/company/khayer",
      instagram: "https://www.instagram.com/khayer",
    },
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle field changes
  const handleChange = (field, value, subField = null) => {
    if (subField) {
      setFormData({
        ...formData,
        [field]: { ...formData[field], [subField]: value },
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  // Step validation
  const validateStep = (activeStep) => {
    setError(null);

    if (activeStep === 0) {
      if (
        validator.isEmpty(formData.legalName) ||
        validator.isEmpty(formData.commonName) ||
        validator.isEmpty(formData.registrationNumber) ||
        !validator.isDate(formData.establishmentDate) ||
        validator.isEmpty(formData.registrationCountry) ||
        validator.isEmpty(formData.organizationType)
      ) {
        setError("يرجى ملء جميع الحقول المطلوبة في هذه الخطوة.");
        return false;
      }
    }

    if (activeStep === 1) {
      if (
        validator.isEmpty(formData.contactPerson) ||
        validator.isEmpty(formData.address.street) ||
        validator.isEmpty(formData.address.city) ||
        validator.isEmpty(formData.address.state) ||
        validator.isEmpty(formData.address.postalCode) ||
        validator.isEmpty(formData.address.country)
      ) {
        setError("يرجى ملء جميع الحقول في معلومات الاتصال.");
        return false;
      }
    }

    if (activeStep === 2) {
      if (
        validator.isEmpty(formData.missionStatement) ||
        validator.isEmpty(formData.activitiesOverview) ||
        validator.isEmpty(formData.targetedBeneficiaries) ||
        validator.isEmpty(formData.activityAreas)
      ) {
        setError("بيان الرسالة مطلوب.");
        return false;
      }
    }
    if (activeStep === 3) {
      if (
        validator.isEmpty(formData.legalInfo.financialReport?.name ?? "") ||
        validator.isEmpty(formData.legalInfo.financialReport?.name ?? "") ||
        validator.isEmpty(formData.legalInfo.fundingSource) ||
        validator.isEmpty(formData.legalInfo.taxID)
      ) {
        setError("جميع المعلومات القانونية والمالية مطلوبة");
        return false;
      }
    }
    if (activeStep === 4) {
      if (
        validator.isEmpty(formData.bankDetails.bankName) ||
        validator.isEmpty(formData.bankDetails.accountNumber)
      ) {
        setError("تفاصيل حساب البنك للتبرعات  مطلوبة");
        return false;
      }
    }
    if (activeStep === 5) {
      if (
        validator.isEmpty(
          formData.additionalDocuments.foundingContract?.name ?? ""
        ) ||
        validator.isEmpty(
          formData.additionalDocuments.boardMembers?.name ?? ""
        ) ||
        validator.isEmpty(
          formData.additionalDocuments.additionalCertificates?.name
        )
      ) {
        setError("الوثائق الاضافية مطلوبة");
        return false;
      }
    }

    return true;
  };
  const handleSubmit = useCallback(async () => {
    try {
      const newFormData = new FormData();

      // إضافة الحقول النصية
      Object.keys(formData).forEach((key) => {
        const value = formData[key];

        if (value && typeof value === "object" && !(value instanceof File)) {
          // إذا كان الحقل كائناً متداخلاً مثل address
          Object.keys(value).forEach((subKey) => {
            newFormData.append(`${key}[${subKey}]`, value[subKey]);
          });
        } else if (value) {
          newFormData.append(key, value);
        }
      });

      setLoading(true);

      // إرسال البيانات إلى الخادم
      await createCharity(newFormData, userToken);
      Swal.fire({
        title: "تم التسجيل بنجاح",
        text: "تم تسجيل الجمعية الخيرية بنجاح. سيتم مراجعة الطلب قريبًا.",
        icon: "success",
      });
      await checkAuthentication(userToken);
      // انتقال بعد النجاح
      router.replace("/account/profile");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "حدث خطأ ما. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const steps = [
    {
      title: "معلومات المنظمة",
      content: (
        <div className="space-y-4">
          <Input
            variant="standard"
            label="الاسم القانوني الكامل"
            value={formData.legalName}
            onChange={(e) => handleChange("legalName", e.target.value)}
            required
          />
          <Input
            variant="standard"
            label="الاسم الشائع"
            value={formData.commonName}
            onChange={(e) => handleChange("commonName", e.target.value)}
          />
          <Input
            variant="standard"
            label="رقم التسجيل"
            value={formData.registrationNumber}
            onChange={(e) => handleChange("registrationNumber", e.target.value)}
            required
          />
          <Input
            variant="standard"
            label="تاريخ التأسيس"
            type="date"
            value={formData.establishmentDate}
            onChange={(e) => handleChange("establishmentDate", e.target.value)}
            required
          />
          <Input
            variant="standard"
            label="بلد التسجيل"
            value={formData.registrationCountry}
            onChange={(e) =>
              handleChange("registrationCountry", e.target.value)
            }
            required
          />
          <Input
            variant="standard"
            label="نوع المنظمة"
            value={formData.organizationType}
            onChange={(e) => handleChange("organizationType", e.target.value)}
            required
          />
        </div>
      ),
    },
    {
      title: "معلومات الاتصال",
      content: (
        <div className="space-y-4">
          <Input
            variant="standard"
            label="اسم الشخص المشرف"
            value={formData.contactPerson}
            onChange={(e) => handleChange("contactPerson", e.target.value)}
            required
          />
          <Input
            variant="standard"
            label="المنصب/الوظيفة"
            value={formData.position}
            onChange={(e) => handleChange("position", e.target.value)}
          />

          <Typography className="font-bold font-ElMessiri">
            العنوان :{formData.address.street}, {formData.address.city},
            {formData.address.state}, {formData.address.country}
          </Typography>
          <Input
            variant="standard"
            label="الشارع"
            value={formData.address.street}
            onChange={(e) => handleChange("address", e.target.value, "street")}
            required
          />

          <Input
            variant="standard"
            label="المدينة"
            value={formData.address.city}
            onChange={(e) => handleChange("address", e.target.value, "city")}
            required
          />

          <Input
            variant="standard"
            label="الولاية/ المقاطعة"
            value={formData.address.state}
            onChange={(e) => handleChange("address", e.target.value, "state")}
            required
          />

          <Input
            variant="standard"
            label="البلد"
            value={formData.address.country}
            onChange={(e) => handleChange("address", e.target.value, "country")}
            required
          />
          <Input
            variant="standard"
            label="الرمز البريدي"
            type="number"
            value={formData.address.postalCode}
            onChange={(e) =>
              handleChange("address", e.target.value, "postalCode")
            }
            required
          />
        </div>
      ),
    },
    {
      title: "الرسالة والأنشطة",
      content: (
        <div className="space-y-4">
          <Textarea
            label="بيان الرسالة"
            value={formData.missionStatement}
            onChange={(e) => handleChange("missionStatement", e.target.value)}
            required
          />
          <Textarea
            label="نظرة عامة على الأنشطة"
            value={formData.activitiesOverview}
            onChange={(e) => handleChange("activitiesOverview", e.target.value)}
            required
          />
          <Textarea
            label="المستفيدون المستهدفون (مثل : الأسر المعوزة، الايتام ، المرضى)"
            value={formData.targetedBeneficiaries}
            onChange={(e) =>
              handleChange("targetedBeneficiaries", e.target.value)
            }
            required
          />
          <Input
            variant="standard"
            label="المناطق الجغرافية للنشاط"
            value={formData.activityAreas}
            onChange={(e) => handleChange("activityAreas", e.target.value)}
            required
          />
        </div>
      ),
    },
    {
      title: "المعلومات القانونية والمالية",
      content: (
        <div className="space-y-4">
          <Input
            variant="standard"
            label="نسخة من شهادة التسجيل"
            type="file"
            icon={<MdUploadFile size={20} />}
            onChange={(e) =>
              handleChange(
                "legalInfo",
                e.target.files[0],
                "registrationCertificate"
              )
            }
            required
          />
          <Input
            variant="standard"
            label="التقرير السنوي الأخير أو البيان المالي"
            type="file"
            icon={<MdUploadFile size={20} />}
            onChange={(e) =>
              handleChange("legalInfo", e.target.files[0], "financialReport")
            }
            required
          />
          <Input
            variant="standard"
            label="مصدر التمويل للجمعية (اشتراك الأعضاء، منح، تبرعات)"
            onChange={(e) =>
              handleChange("legalInfo", e.target.value, "fundingSource")
            }
          />
          <Input
            variant="standard"
            label="رقم التعريف الضريبي"
            value={formData.legalInfo.taxID}
            onChange={(e) => handleChange("legalInfo", e.target.value, "taxID")}
            required
          />
        </div>
      ),
    },
    {
      title: "تفاصيل حساب البنك للتبرعات",
      content: (
        <div className="space-y-4">
          <Input
            variant="standard"
            label="اسم البنك"
            value={formData.bankDetails.bankName}
            onChange={(e) =>
              handleChange("bankDetails", e.target.value, "bankName")
            }
            required
          />
          <Input
            variant="standard"
            label="رقم الحساب"
            value={formData.bankDetails.accountNumber}
            onChange={(e) =>
              handleChange("bankDetails", e.target.value, "accountNumber")
            }
            required
          />
          <Input
            variant="standard"
            label="IBAN ااذا كان متوفر"
            value={formData.bankDetails.IBAN}
            onChange={(e) =>
              handleChange("bankDetails", e.target.value, "IBAN")
            }
          />
          <Input
            variant="standard"
            label="SWIFT اذا كان متوفر "
            value={formData.bankDetails.SWIFT}
            onChange={(e) =>
              handleChange("bankDetails", e.target.value, "SWIFT")
            }
          />
        </div>
      ),
    },
    {
      title: "الوثائق الاضافية",
      content: (
        <div className="space-y-4">
          <Input
            variant="standard"
            label="عقد التأسيس (وثيقة قانونية لتأسيس المنظمة) أو اللوائح الداخلية (القواعد الداخلية التي تحكم المنظمة)"
            type="file"
            icon={<MdUploadFile size={20} />}
            onChange={(e) =>
              handleChange(
                "additionalDocuments",
                e.target.files[0],
                "foundingContract"
              )
            }
            required
          />
          <Input
            variant="standard"
            label="قائمة مجلس الإدارة (بما في ذلك الأسماء والوظائف)"
            type="file"
            icon={<MdUploadFile size={20} />}
            onChange={(e) =>
              handleChange(
                "additionalDocuments",
                e.target.files[0],
                "boardMembers"
              )
            }
            required
          />
          <Input
            variant="standard"
            label="أي شهادات أو اعتمادات ذات صلة"
            type="file"
            icon={<MdUploadFile size={20} />}
            multiple
            onChange={(e) =>
              handleChange(
                "additionalDocuments",
                e.target.files[0],
                "additionalCertificates"
              )
            }
            required
          />
        </div>
      ),
    },
    {
      title: "الحضور الرقمي",
      content: (
        <div className="space-y-4">
          <Input
            variant="standard"
            label=" رابط الموقع الرسمي (إذا كان متاحًا) "
            value={formData.digitalPresence.website}
            onChange={(e) =>
              handleChange("digitalPresence", e.target.value, "website")
            }
          />
          <Input
            icon={<FaFacebook size={20} />}
            variant="standard"
            label=" رابط حساب الفيسبوك "
            value={formData.digitalPresence.facebook}
            onChange={(e) =>
              handleChange("digitalPresence", e.target.value, "facebook")
            }
          />
          <Input
            icon={<FaTwitter size={20} />}
            variant="standard"
            label="رابط حساب تويتر"
            value={formData.digitalPresence.twitter}
            onChange={(e) =>
              handleChange("digitalPresence", e.target.value, "twitter")
            }
          />
          <Input
            icon={<FaLinkedin size={20} />}
            variant="standard"
            label="رابط حساب لينكد اين (linkedIn)"
            value={formData.digitalPresence.linkedin}
            onChange={(e) =>
              handleChange("digitalPresence", e.target.value, "linkedin")
            }
          />
          <Input
            icon={<FaInstagram size={20} />}
            variant="standard"
            label="رابط حساب انستغرام"
            value={formData.digitalPresence.instagram}
            onChange={(e) =>
              handleChange("digitalPresence", e.target.value, "instagram")
            }
          />
        </div>
      ),
    },
  ];
  useEffect(() => {
    user.registrationStatus === "COMPLETED" &&
      router.replace("/account/profile");
  }, [user]);
  return (
    <div className="p-6 space-y-8 grid place-items-center" dir="rtl">
      <div className="flex flex-col w-full max-w-3xl gap-3 items-center justify-center">
        <Typography variant="h3" className="text-center">
          تسجيل حساب جمعية خيرية
        </Typography>
        <AnimatedParagraphs />
        {error && (
          <Alert color="red" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
      </div>
      <CustomStepper
        steps={steps}
        validateStep={validateStep}
        loading={loading}
        handleSubmit={handleSubmit}
      />
      <div className="w-full max-w-3xl flex items-center gap-2 p-5 rounded-md  bg-mangoBlack">
        {/* Google checkAuthentication */}
        <Button
          color="indigo"
          variant="outlined"
          className="rounded-full"
          onClick={() => router.push("/account/checkAuthentication")}
        >
          تسجيل الدخول الى حسابي
        </Button>
        <Button
          color="teal"
          variant="outlined"
          className="rounded-full"
          onClick={() => router.push("/account/password-reset")}
        >
          استعادة كلمة السر
        </Button>
        <GoogleLoginComponent />
      </div>
    </div>
  );
}

const AnimatedParagraphs = () => {
  const paragraphs = [
    "انضم إلى مجتمع الجمعيات الخيرية الرائد وساهم في تحقيق الأهداف الإنسانية والتنموية. من خلال تسجيل حسابك، ستتمكن من توسيع دائرة التأثير، وإدارة مشاريعك بفعالية، والوصول إلى المزيد من الداعمين والمستفيدين.",
    "سواء كنت تسعى لدعم الأسر المحتاجة، رعاية الأيتام، أو تعزيز التعليم والصحة، فإن منصتنا توفر لك الأدوات اللازمة لتحقيق رسالتك.",
    "لا تفوت فرصة النمو والتعاون مع شركاء النجاح الآخرين. سجل الآن وابدأ رحلتك نحو إحداث التغيير الإيجابي في مجتمعك والعالم.",
  ];

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6, // Delay between each paragraph
      },
    },
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-6  text-gray-700 dark:text-gray-200 p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      dir="rtl"
    >
      {paragraphs.map((text, index) => (
        <motion.p
          key={index}
          className="text-lg font-medium text-justify"
          variants={paragraphVariants}
        >
          {text}
        </motion.p>
      ))}
    </motion.div>
  );
};
