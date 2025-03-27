"use client";
import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Checkbox,
  Alert,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import validator from "validator";
import { useRouter } from "next/navigation";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useCredentials } from "@/context/CredentialsContext";
import Image from "next/image";
import GoogleLoginComponent from "@/components/layouts/GoogleLogin";
import Swal from "sweetalert2";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const { isLoggedIn, loading, setLoading, login, saveLogin, setSaveLogin } =
    useCredentials();
  const router = useRouter();

  const handleLogin = async () => {
    if (!validator.isEmail(email)) {
      setAlert({ type: "error", message: "البريد الإلكتروني غير صحيح" });
      return;
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 8 })
    ) {
      setAlert({
        type: "error",
        message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
        rememberMe: saveLogin,
      });
      if (response.data.token) {
        login(response.data.token);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "حدث خطأ ما، حاول مرة أخرى.";
      setAlert({ type: "error", message: errorMessage });
      if (error.response?.status === 403) {
        router.push("/check-code", { query: { email } });
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(false);
  }, []);
  useEffect(() => {
    isLoggedIn && router.replace("/account/profile");
  }, [isLoggedIn]);
  return (
    <div
      className="min-h-[70vh] w-full flex flex-col justify-center items-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-nav_bg shadow-md rounded-lg p-6">
        <div className="w-full flex items-center justify-center m-2">
          <Image width={200} height={200} src={"/logo/fullLogo.png"} />
        </div>
        {/* عنوان الصفحة */}
        <Typography variant="h4" className="text-center font-bold mb-6">
          تسجيل الدخول
        </Typography>

        {/* رسالة الخطأ أو النجاح */}
        {alert.message && (
          <Alert
            color={alert.type === "error" ? "red" : "green"}
            dismissible
            onClose={() => setAlert({ type: "", message: "" })}
            className="mb-4"
          >
            {alert.message}
          </Alert>
        )}

        {/* نموذج تسجيل الدخول */}
        <form className="space-y-6">
          {/* حقل البريد الإلكتروني */}
          <Input
            variant="standard"
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="lg"
            className="text-left text-textColor"
            placeholder="أدخل البريد الإلكتروني"
            autoComplete={email.toString()}
          />

          {/* حقل كلمة المرور */}
          <div className="relative">
            <Input
              variant="standard"
              autoComplete
              label="كلمة المرور"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="lg"
              className="text-right"
              placeholder="أدخل كلمة المرور"
            />
            <button
              type="button"
              className="absolute left-3 top-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-600" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* خيار حفظ تسجيل الدخول */}
          <div className="flex items-center justify-between">
            <Checkbox
              label="تذكرني"
              checked={saveLogin}
              onChange={(e) => setSaveLogin(e.target.checked)}
            />
            <Button
              variant="text"
              color="blue"
              className="text-sm"
              onClick={() =>
                router.push("/account/password-reset?email=" + email)
              }
            >
              نسيت كلمة المرور؟
            </Button>
          </div>

          {/* زر تسجيل الدخول */}
          <Button
            onClick={handleLogin}
            fullWidth
            className="rounded-full"
            loading={loading}
          >
            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
          </Button>
          <GoogleLoginComponent />
        </form>

        {/* روابط إضافية */}
        <div className="text-center mt-4">
          <Typography variant="small" className="text-gray-600">
            ليس لديك حساب؟
            <Button
              variant="text"
              color="blue"
              onClick={() => router.push("/account/register")}
              className="text-sm font-medium"
            >
              إنشاء حساب جديد
            </Button>
          </Typography>
        </div>
      </div>
    </div>
  );
}
