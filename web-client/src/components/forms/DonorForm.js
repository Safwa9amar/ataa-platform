"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Input,
  Button,
  Typography,
  Alert,
  Checkbox,
} from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleLoginComponent from "@/components/layouts/GoogleLogin";
import validator from "validator";
import CustomStepper from "../layouts/CustomStepper";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import Swal from "sweetalert2";
import axios from "axios";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";
import PasswordRequirement from "../UI/PasswordRequirement";

export default function RegisterPage() {
  const { user, saveLogin, checkAuthentication } = useCredentials();

  const router = useRouter();
  const { password, validations, onPasswordChange } = usePasswordValidation({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

  const {
    setValue,
    register,
    handleSubmit,
    watch,
    setError: setFormError,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      verificationCode: null,
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
    },
    mode: "onChange",
  });

  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Step validation
  const validateStep = async (step) => {
    let isValid = false;

    if (step === 0) {
      isValid = await trigger(["name", "email", "phone"]);
    }

    if (step === 1) {
      isValid = await trigger([
        "address.street",
        "address.city",
        "address.state",
        "address.postalCode",
        "address.country",
      ]);
      if (isValid) {
        setLoading(true);
        try {
          const { name, email, phone, address } = watch();
          const response = await axios.post(API_ENDPOINTS.AUTH.SIGNUP, {
            name,
            email,
            phone,
            address,
          });
          Swal.fire({
            title: "التسجيل الأولي",
            text: response.data.message,
            icon: "info",
          });
          setActiveStep(2); // Move to the next step
        } catch (error) {
          setFormError("root", {
            type: "manual",
            message:
              error?.response?.data?.message || "حدث خطأ ما، حاول مرة أخرى.",
          });
        } finally {
          setLoading(false);
        }
      }
    }

    if (step === 2) {
      isValid = await trigger("verificationCode");
    }

    return isValid;
  };

  // Form submission
  const onSubmit = async (data) => {
    if (!privacyChecked) {
      setFormError("root", {
        type: "manual",
        message: "يجب الموافقة على الشروط والأحكام.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(API_ENDPOINTS.AUTH.VERIFY_SIGNUP, {
        email: data.email,
        verificationCode: data.verificationCode,
        password: data.password,
        rememberMe: saveLogin,
      });

      if (response.status === 200) {
        Swal.fire({
          text: "تم تسجيل حسابك بنجاح",
          icon: "success",
        });

        checkAuthentication(response.data.token);
        router.push("/account/register/type");
      }
    } catch (error) {
      setFormError("root", {
        type: "manual",
        message: error.response?.data?.message || "حدث خطأ ما، حاول مرة أخرى.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.registrationStatus === "COMPLETED") {
      router.replace("/account/profile");
    }
  }, [user]);

  const steps = [
    {
      title: "المعلومات الشخصية",
      content: (
        <div className="space-y-4">
          <Input
            {...register("name", { required: "اسم المستخدم مطلوب" })}
            variant="standard"
            label="اسم المستخدم"
            error={!!errors.name}
            key={"name"}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}

          <Input
            {...register("email", {
              required: "البريد الإلكتروني مطلوب",
              validate: (value) =>
                validator.isEmail(value) || "البريد الإلكتروني غير صحيح",
            })}
            variant="standard"
            label="البريد الإلكتروني"
            type="email"
            error={!!errors.email}
            key={"email"}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}

          <Input
            {...register("phone", {
              required: "رقم الهاتف مطلوب",
              validate: (value) =>
                validator.isMobilePhone(value, "ar-DZ") ||
                "رقم الهاتف غير صحيح",
            })}
            variant="standard"
            label="رقم الهاتف"
            type="tel"
            error={!!errors.phone}
            key={"tel"}
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}
        </div>
      ),
    },
    {
      title: "العنوان الشخصي",
      content: (
        <div className="space-y-4">
          <Input
            {...register("address.street", { required: "العنوان مطلوب" })}
            variant="standard"
            label="العنوان"
            error={!!errors.address?.street}
            key={"street"}
          />
          {errors.address?.street && (
            <span className="text-red-500 text-sm">
              {errors.address?.street.message}
            </span>
          )}

          <Input
            {...register("address.city", { required: "المدينة مطلوبة" })}
            variant="standard"
            label="المدينة"
            error={!!errors.address?.city}
            key={"city"}
          />
          {errors.address?.city && (
            <span className="text-red-500 text-sm">
              {errors.address?.city.message}
            </span>
          )}

          <Input
            {...register("address.state", { required: "المنطقة مطلوبة" })}
            variant="standard"
            label="المنطقة"
            error={!!errors.address?.state}
            key={"state"}
          />
          {errors.address?.state && (
            <span className="text-red-500 text-sm">
              {errors.address?.state.message}
            </span>
          )}

          <Input
            {...register("address.postalCode", {
              required: "الرمز البريدي مطلوب",
            })}
            variant="standard"
            label="الرمز البريدي"
            error={!!errors.address?.postalCode}
            key="postalCode"
          />
          {errors.address?.postalCode && (
            <span className="text-red-500 text-sm">
              {errors.address?.postalCode.message}
            </span>
          )}

          <Input
            {...register("address.country", { required: "البلد مطلوب" })}
            variant="standard"
            label="البلد"
            error={!!errors.address?.country}
            key="country"
          />
          {errors.address?.country && (
            <span className="text-red-500 text-sm">
              {errors.address?.country.message}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "التحقق من البريد الإلكتروني",
      content: (
        <div className="space-y-4">
          <Input
            {...register("verificationCode", { required: "الكود مطلوب" })}
            variant="standard"
            label="أدخل الكود المرسل على بريدك الإلكتروني"
            error={!!errors.verificationCode}
            key="verificationCode"
          />
          {errors.verificationCode && (
            <span className="text-red-500 text-sm">
              {errors.verificationCode.message}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "إعداد كلمة المرور",
      content: (
        <div className="space-y-4">
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
            {...register("password", {
              required: "كلمة المرور مطلوبة",
            })}
            onChange={(e) => {
              onPasswordChange(e.target.value);
              setValue("password", e.target.value);
            }}
            variant="standard"
            label="كلمة المرور"
            type="password"
            error={!!errors.password}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}

          <Input
            {...register("confirmPassword", {
              required: "تأكيد كلمة المرور مطلوب",
              validate: (value) =>
                value === watch("password") || "كلمة المرور غير متطابقة",
            })}
            variant="standard"
            label="تأكيد كلمة المرور"
            type="password"
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}

          <div className="flex items-center gap-1">
            <Checkbox
              checked={privacyChecked}
              onChange={(e) => setPrivacyChecked(e.target.checked)}
            />
            <Link href={"/privacy-policy"}>أوافق على الشروط والأحكام</Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center p-6"
      dir="rtl"
    >
      <div className="w-full max-w-3xl space-y-8 flex flex-col items-start">
        <Typography
          variant="h3"
          className="text-center font-ElMessiri text-gray-800 dark:text-gray-100 font-bold"
        >
          إنشاء حساب جديد
        </Typography>
        <Typography
          variant="small"
          className="text-center text-gray-600 font-ElMessiri text-lg dark:text-gray-400"
        >
          قم بإنشاء حسابك للوصول إلى جميع خدماتنا.
        </Typography>

        {errors.root?.message && (
          <Alert
            color="red"
            dismissible
            onClose={() => setFormError("root", null)}
          >
            {errors.root.message}
          </Alert>
        )}

        <CustomStepper
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          validateStep={validateStep}
          steps={steps}
          loading={loading}
          handleSubmit={handleSubmit(onSubmit)}
        />

        <div className="grid grid-cols-3 gap-5 p-5 rounded-md w-full bg-mangoBlack">
          <Button
            color="indigo"
            variant="outlined"
            className="rounded-full hover:bg-indigo-700 hover:text-white"
            onClick={() => router.push("/account/login")}
          >
            تسجيل الدخول الى حسابي
          </Button>
          <Button
            color="teal"
            variant="outlined"
            className="rounded-full hover:bg-teal-700 hover:text-white"
            onClick={() => router.push("/account/password-reset")}
          >
            استعادة كلمة السر
          </Button>
          <GoogleLoginComponent />
        </div>
      </div>
    </motion.div>
  );
}
