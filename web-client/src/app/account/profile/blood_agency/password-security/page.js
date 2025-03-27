"use client";

import React, { useState } from "react";
import { Typography, Card, Input, Button } from "@material-tailwind/react";
import { useCredentials } from "@/context/CredentialsContext";
import { updatePassword } from "@/services/userServices";
import validator from "validator";

export default function PasswordSecurity() {
  const { userToken } = useCredentials();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    if (!validator.isLength(password, { min: 8 })) {
      return "كلمة المرور يجب أن تكون 8 أحرف على الأقل.";
    }
    if (
      !validator.isStrongPassword(password, {
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return "كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم ورمز خاص.";
    }
    return null;
  };
  const handlePasswordUpdate = async () => {
    setError(null);
    setSuccess(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("كلمات المرور الجديدة غير متطابقة.");
      return;
    }

    const passwordValidationError = validatePassword(formData.newPassword);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }

    setLoading(true);
    try {
      await updatePassword(
        userToken,
        formData.currentPassword,
        formData.newPassword
      );
      setSuccess("تم تحديث كلمة المرور بنجاح.");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء تحديث كلمة المرور.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card
      dir="rtl"
      className="mx-auto shadow-md p-6 md:p-8 bg-white dark:bg-gray-800"
    >
      <Typography
        variant="h2"
        className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6"
      >
        الأمان وكلمة المرور
      </Typography>

      <div className="space-y-6">
        {/* Current Password */}
        <div>
          <Typography className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">
            كلمة المرور الحالية
          </Typography>
          <Input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            className="mt-2"
          />
        </div>

        {/* New Password */}
        <div>
          <Typography className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">
            كلمة المرور الجديدة
          </Typography>
          <Input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="mt-2"
          />
        </div>

        {/* Confirm New Password */}
        <div>
          <Typography className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">
            تأكيد كلمة المرور الجديدة
          </Typography>
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="mt-2"
          />
        </div>

        {/* Error Message */}
        {error && (
          <Typography className="text-red-500 text-sm">{error}</Typography>
        )}

        {/* Success Message */}
        {success && (
          <Typography className="text-green-500 text-sm">{success}</Typography>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-4">
          <Button
            onClick={handlePasswordUpdate}
            disabled={loading}
            className="bg-primaryColor text-white shadow-md"
          >
            {loading ? "جارٍ الحفظ..." : "تحديث كلمة المرور"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
