"use client";

import React, { useEffect, useState } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import CustomStepper from "@/components/layouts/CustomStepper";
import Swal from "sweetalert2";
import axios from "axios";
import validator from "validator";
import { createBloodAgency } from "@/services/bloodAgencyService";
import { useCredentials } from "@/context/CredentialsContext";
import { useRouter } from "next/navigation";

export default function BloodAgencyRegistration() {
  const { user, userToken, checkAuthentication } = useCredentials();
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    agencyName: "الوكالة الوطنية للتبرع بالدم",
    officialEmail: "info@bloodagency.dz",
    phone: "+213661234567",
    address: {
      city: "الجزائر العاصمة",
      state: "ولاية الجزائر",
    },
    // Step 2: Contact Info
    contactPerson: "محمد أمين",
    jobTitle: "مدير العمليات",
    contactEmail: "director@bloodagency.dz",
    contactPhone: "+213669876543",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (field, value, subField = null) => {
    if (subField) {
      setFormData({
        ...formData,
        [field]: { ...formData[field], [subField]: value },
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
    setErrors({ ...errors, [field]: false });
  };

  // Validation logic
  const validateStep = (activeStep) => {
    const newErrors = {};
    if (activeStep === 0) {
      if (validator.isEmpty(formData.agencyName)) {
        newErrors.agencyName = "يرجى إدخال الاسم الكامل للوكالة.";
      }
      if (!validator.isEmail(formData.officialEmail)) {
        newErrors.officialEmail = "يرجى إدخال بريد إلكتروني رسمي صالح.";
      }
      if (!validator.isMobilePhone(formData.phone, "ar-DZ")) {
        newErrors.phone = "يرجى إدخال رقم هاتف صحيح.";
      }
      if (validator.isEmpty(formData.address.city)) {
        newErrors.city = "يرجى إدخال المدينة.";
      }
      if (validator.isEmpty(formData.address.state)) {
        newErrors.state = "يرجى إدخال الولاية.";
      }
    }

    if (activeStep === 1) {
      if (validator.isEmpty(formData.contactPerson)) {
        newErrors.contactPerson = "يرجى إدخال اسم الشخص المشرف.";
      }
      if (validator.isEmpty(formData.jobTitle)) {
        newErrors.jobTitle = "يرجى إدخال المنصب أو الوظيفة.";
      }
      if (!validator.isEmail(formData.contactEmail)) {
        newErrors.contactEmail = "يرجى إدخال بريد إلكتروني صحيح.";
      }
      if (!validator.isMobilePhone(formData.contactPhone, "ar-DZ")) {
        newErrors.contactPhone = "يرجى إدخال رقم هاتف صحيح.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit logic
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createBloodAgency(formData, userToken);
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
        text: "حدث خطأ ما، حاول مرة أخرى.",
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
          <Input
            label="الاسم الكامل للوكالة"
            error={!!errors.agencyName}
            value={formData.agencyName}
            onChange={(e) => handleChange("agencyName", e.target.value)}
          />
          <Input
            label="البريد الإلكتروني الرسمي"
            error={!!errors.officialEmail}
            value={formData.officialEmail}
            onChange={(e) => handleChange("officialEmail", e.target.value)}
          />
          <Input
            label="رقم الهاتف"
            error={!!errors.phone}
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <Input
            label="المدينة"
            error={!!errors.city}
            value={formData.address.city}
            onChange={(e) => handleChange("address", e.target.value, "city")}
          />
          <Input
            label="الولاية"
            error={!!errors.state}
            value={formData.address.state}
            onChange={(e) => handleChange("address", e.target.value, "state")}
          />
        </div>
      ),
    },
    {
      title: "معلومات الاتصال",
      content: (
        <div className="space-y-4">
          <Input
            label="إسم الشخص المشرف على إدارة الحساب"
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
  ];

  useEffect(() => {
    user.registrationStatus === "COMPLETED" &&
      router.replace("/account/profile");
  }, [user]);
  return (
    <div className="container mx-auto p-6" dir="rtl">
      <Typography variant="h4" className="mb-4">
        تسجيل حساب وكالة التبرع بالدم
      </Typography>
      <Typography variant="paragraph" className="text-gray-700 mb-8">
        قم بتسجيل حساب لوكالة التبرع بالدم للاستفادة من خدماتنا في إدارة حملات
        التبرع بالدم وربط الوكالات بالمتبرعين.
      </Typography>
      <CustomStepper
        steps={steps}
        validateStep={validateStep}
        loading={loading}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
