"use client";

import React, { useEffect, useState } from "react";
import { Input, Button, Typography, Textarea } from "@material-tailwind/react";
import CustomStepper from "@/components/layouts/CustomStepper";
import Swal from "sweetalert2";
import axios from "axios";
import validator from "validator";
import {
  FaFacebook,
  FaInstagram,
  FaLink,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa6";
import { validateStep } from "./PartnerFormValidation";
import { createPartner } from "@/services/PartnerSevices";
import { useCredentials } from "@/context/CredentialsContext";
import { useRouter } from "next/navigation";

function PartnerRegistrationPage() {
  const { user, userToken, checkAuthentication } = useCredentials();
  const router = useRouter();
  const [formData, setFormData] = useState({
    step1Completed: false,
    // Step 1: Basic Info
    entityType: "INDIVIDUAL", // "individual" or "company"
    fullName: "محمد علي",
    email: "mohamed.ali@example.com",
    phone: "+213558123456",
    businessType: "تجارة التجزئة",
    mainAddress: "شارع الاستقلال، الجزائر العاصمة، الجزائر",
    companyName: "",

    // Step 2: Contact Info
    contactPerson: "محمد علي",
    jobTitle: "مدير الأعمال",
    position: "مالك",
    contactEmail: "mohamed.ali@example.com",
    contactPhone: "+213558123456",

    // Step 3: Registration and Licenses
    registrationNumber: "RC123456",
    taxID: "TIN789012",
    licenses: "رخصة تجارة التجزئة رقم 2024/12",

    // Step 4: Payment Info
    bankDetails: "بنك الجزائر، حساب رقم 123456789012",
    acceptedPaymentMethods:
      "الدفع نقدًا، الدفع عبر التحويل البنكي، بطاقة الائتمان",

    // Step 5: Additional Info
    logo: null,
    digitalPresence: {
      website: "https://www.mohamed-retail.com",
      facebook: "https://www.facebook.com/mohamed.retail",
      twitter: "https://www.twitter.com/mohamed_retail",
      linkedin: "https://www.linkedin.com/company/mohamed-retail",
      instagram: "https://www.instagram.com/mohamed_retail",
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value, subField = null) => {
    if (subField) {
      setFormData({
        ...formData,
        [field]: { ...formData[field], [subField]: value },
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
    setErrors({ ...errors, [field]: false }); // Reset error for this field
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createPartner(formData, userToken);
      Swal.fire({
        title: "تم التسجيل بنجاح",
        icon: "success",
      });
      await checkAuthentication(userToken);
      // انتقال بعد النجاح
      router.replace("/account/profile");
    } catch (error) {
      Swal.fire({
        title: "خطأ",
        text: error.response?.data?.message || "حدث خطأ ما، حاول مرة أخرى.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "معلومات أساسية",
      content: (
        <div className="space-y-4">
          <Typography variant="h6">هل أنت فرد أم شركة؟</Typography>
          <div className="flex gap-4">
            <Button
              color={formData.entityType === "INDIVIDUAL" ? "blue" : "gray"}
              onClick={() => handleChange("entityType", "INDIVIDUAL")}
            >
              فرد
            </Button>
            <Button
              color={formData.entityType === "COMPANY" ? "blue" : "gray"}
              onClick={() => handleChange("entityType", "COMPANY")}
            >
              شركة
            </Button>
          </div>
          {formData.entityType === "INDIVIDUAL" ? (
            <>
              <Input
                label="الاسم الكامل"
                error={!!errors.fullName}
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
              />
              <Input
                label="البريد الإلكتروني"
                error={!!errors.email}
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <Input
                label="رقم الهاتف"
                error={!!errors.phone}
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              <Input
                label="نوع النشاط التجاري"
                error={!!errors.phone}
                value={formData.businessType}
                onChange={(e) => handleChange("businessType", e.target.value)}
              />
              <Input
                label="عنوان المقر الرئيسي"
                error={!!errors.phone}
                value={formData.mainAddress}
                onChange={(e) => handleChange("mainAddress", e.target.value)}
              />
              <Input
                label="رابط الموقع اذا كان متاحا"
                error={!!errors.phone}
                value={formData.digitalPresence.website}
                onChange={(e) =>
                  handleChange("digitalPresence", e.target.value, "website")
                }
              />
            </>
          ) : (
            <>
              <Input
                label="اسم الشركة (ان كان متاحا)"
                error={!!errors.companyName}
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
              />
              <Input
                label="نوع النشاط التجاري"
                error={!!errors.businessType}
                value={formData.businessType}
                onChange={(e) => handleChange("businessType", e.target.value)}
              />
              <Input
                label="عنوان المقر الرئيسي"
                error={!!errors.mainAddress}
                value={formData.mainAddress}
                onChange={(e) => handleChange("mainAddress", e.target.value)}
              />
              <Input
                label="البريد الإلكتروني للشركة"
                error={!!errors.email}
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <Input
                label="رقم هاتف الشركة"
                error={!!errors.phone}
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              <Input
                label="رابط الموقع ان كان متاحا"
                error={!!errors.website}
                value={formData.digitalPresence.website}
                onChange={(e) =>
                  handleChange("digitalPresence", e.target.value, "website")
                }
              />
            </>
          )}
        </div>
      ),
    },
    {
      title: "معلومات الاتصال",
      content: (
        <div className="space-y-4">
          <Input
            label=" إسم الشخص المشرف على ادارة الحساب"
            error={!!errors.contactPerson}
            value={formData.contactPerson}
            onChange={(e) => handleChange("contactPerson", e.target.value)}
          />
          <Input
            label="المنصب أو الوظيفة"
            error={!!errors.jobTitle}
            value={formData.jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
          />
          <Input
            label="البريد الإلكتروني"
            error={!!errors.contactEmail}
            value={formData.contactEmail}
            onChange={(e) => handleChange("contactEmail", e.target.value)}
          />
          <Input
            label="رقم الهاتف"
            error={!!errors.contactPhone}
            value={formData.contactPhone}
            onChange={(e) => handleChange("contactPhone", e.target.value)}
          />
        </div>
      ),
    },
    {
      title: "معلومات التسجيل والتراخيص",
      content: (
        <div className="space-y-4">
          <Input
            label="رقم السجل التجاري"
            error={!!errors.registrationNumber}
            value={formData.registrationNumber}
            onChange={(e) => handleChange("registrationNumber", e.target.value)}
          />
          <Input
            label="رقم التعريف الضريبي"
            error={!!errors.taxID}
            value={formData.taxID}
            onChange={(e) => handleChange("taxID", e.target.value)}
          />
          <Input
            label="التراخيص وشهادات الجودة (اذا كانت متاحة)"
            error={!!errors.licenses}
            value={formData.licenses}
            onChange={(e) => handleChange("licenses", e.target.value)}
          />
        </div>
      ),
    },
    {
      title: "معلومات الدفع والفواتير",
      content: (
        <div className="space-y-4">
          <Textarea
            label="معلومات حساب البنك"
            error={!!errors.bankDetails}
            value={formData.bankDetails}
            onChange={(e) => handleChange("bankDetails", e.target.value)}
          />
          <Textarea
            label="طرق الدفع المقبولة"
            error={!!errors.acceptedPaymentMethods}
            value={formData.acceptedPaymentMethods}
            onChange={(e) =>
              handleChange("acceptedPaymentMethods", e.target.value)
            }
          />
        </div>
      ),
    },
    {
      title: "معلومات اضافية (اختياري)",
      content: (
        <div className="space-y-4">
          <Input
            label="شعار الشركة"
            type="file"
            error={!!errors.logo}
            onChange={(e) => handleChange("logo", e.target.files[0])}
          />
          <Input
            icon={<FaLink size={20} />}
            variant="standard"
            label=" رابط الموقع الالكتروني "
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
    <div className="container mx-auto p-6" dir="rtl">
      <div className="mb-6 p-4 bg-blue-50 rounded-lg shadow max-w-3xl mx-auto">
        <Typography variant="h4" className="font-bold  text-blue-900 mb-2">
          تسجيل حساب مورد أو شركة
        </Typography>
        <Typography className="text-blue-800 font-ElMessiri">
          هذه الصفحة مخصصة لتسجيل الموردين والشركات الراغبين في الانضمام إلى
          منصتنا. من خلال التسجيل، يمكنك عرض خدماتك ومنتجاتك والتواصل مع
          الجمعيات الخيرية للحصول على فرص تعاون.
        </Typography>
      </div>
      <CustomStepper
        steps={steps}
        formData={formData}
        setErrors={setErrors}
        validateStep={validateStep}
        loading={loading}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default PartnerRegistrationPage;
