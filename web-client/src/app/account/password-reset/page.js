"use client";

import React, { useState } from "react";
import { Input, Button, Typography, Alert } from "@material-tailwind/react";
import CustomStepper from "@/components/layouts/CustomStepper";
import API_ENDPOINTS from "@/config/apiEndPoints";
import axios from "axios";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";
import validator from "validator";
import PasswordRequirement from "@/components/UI/PasswordRequirement";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useCredentials } from "@/context/CredentialsContext";

export default function PasswordResetPage({ searchParams }) {
  const { email } = searchParams;
  const router = useRouter();
  const { login } = useCredentials();
  const [formData, setFormData] = useState({
    email: email ?? "",
    verificationCode: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { validations, onPasswordChange } = usePasswordValidation({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

  const validateStep = async (activeStep) => {
    if (activeStep === 0) {
      if (!validator.isEmail(formData.email)) {
        setError("يرجى إدخال بريد إلكتروني صالح.");
        return false;
      }
      setLoading(true);
      try {
        await axios.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
          email: formData.email,
        });
        setSuccess("تم إرسال رمز التحقق إلى بريدك الإلكتروني.");
        setError(null);
        return true;
      } catch (err) {
        setError(err.response?.data?.message || "حدث خطأ ما. حاول مرة أخرى.");
        return false;
      } finally {
        setLoading(false);
      }
    }

    if (activeStep === 1) {
      if (validator.isEmpty(formData.verificationCode)) {
        setError("يرجى إدخال رمز التحقق.");
        return false;
      }
      setError(null);
      return true;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة.");
      return false;
    }
    if (
      !validator.isStrongPassword(formData.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setError("كلمة المرور ضعيفة. تحقق من الشروط أدناه.");
      return false;
    }
    setLoading(true);
    try {
      let res = await axios.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        email: formData.email,
        verificationCode: formData.verificationCode,
        password: formData.password,
      });
      setSuccess("تم إعادة تعيين كلمة المرور بنجاح.");
      setError(null);
      login(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ ما. حاول مرة أخرى.");
    } finally {
      setLoading(false);
      Swal.fire({
        title: "استعادة كلمة المورو",
        text: "تم بنجاح استعادة كلمة المورو ",
        icon: "success",
        timer: 2000,
        didClose: () => router.replace("/account/profile"),
      });
    }
  };

  const steps = [
    {
      title: "إدخال البريد الإلكتروني",
      content: (
        <div className="space-y-4">
          <Input
            variant="standard"
            label="البريد الإلكتروني"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            success={validator.isEmail(formData.email)}
            error={!validator.isEmail(formData.email) && formData.email !== ""}
            required
          />
        </div>
      ),
    },
    {
      title: "إدخال رمز التحقق",
      content: (
        <div className="space-y-4">
          <Input
            variant="standard"
            label="رمز التحقق"
            value={formData.verificationCode}
            onChange={(e) =>
              setFormData({ ...formData, verificationCode: e.target.value })
            }
            required
          />
        </div>
      ),
    },
    {
      title: "إعداد كلمة المرور",
      content: (
        <div className="space-y-4">
          {/* Password Validation Feedback */}
          <div className="space-y-2 text-right">
            <PasswordRequirement
              isValid={validations.minLength}
              message="يجب أن تكون كلمة المرور 8 أحرف على الأقل."
            />
            <PasswordRequirement
              isValid={validations.hasLowercase}
              message="يجب أن تحتوي على حرف صغير واحد على الأقل (a-z)."
            />
            <PasswordRequirement
              isValid={validations.hasUppercase}
              message="يجب أن تحتوي على حرف كبير واحد على الأقل (A-Z)."
            />
            <PasswordRequirement
              isValid={validations.hasNumber}
              message="يجب أن تحتوي على رقم واحد على الأقل (0-9)."
            />
            <PasswordRequirement
              isValid={validations.hasSymbol}
              message="يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)."
            />
          </div>
          <Input
            variant="standard"
            label="كلمة المرور"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              onPasswordChange(e.target.value);
            }}
            required
          />
          <Input
            variant="standard"
            label="تأكيد كلمة المرور"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex justify-center items-center  p-6" dir="rtl">
      <div className="w-full max-w-3xl space-y-8 flex flex-col items-start">
        <Typography
          variant="h3"
          className="text-center font-ElMessiri text-gray-800 dark:text-gray-100 font-bold"
        >
          إعادة تعيين كلمة المرور
        </Typography>
        <Typography
          variant="small"
          className="text-center text-gray-600 font-ElMessiri text-lg dark:text-gray-400"
        >
          أدخل بريدك الإلكتروني ورمز التحقق لإعادة تعيين كلمة المرور الخاصة بك.
        </Typography>

        {/* Error Message */}
        {error && (
          <Alert
            color="red"
            dismissible
            onClose={() => setError(null)}
            className="mt-4"
          >
            {error}
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert
            color="green"
            dismissible
            onClose={() => setSuccess(null)}
            className="mt-4"
          >
            {success}
          </Alert>
        )}

        <CustomStepper
          validateStep={validateStep}
          steps={steps}
          loading={loading}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
