"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Input,
  Button,
  Checkbox,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { useCredentials } from "@/context/CredentialsContext";

export default function AccountInfo() {
  const { user, updateUser, loading } = useCredentials();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      isVisible: user?.isVisible || false,
    },
  });

  useEffect(() => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      isVisible: user?.isVisible || false,
    });
  }, [user, reset]);

  const onSubmit = (data) => {
    updateUser(data);
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const isVisibleChecked = watch("isVisible");

  return (
    <Card
      dir="rtl"
      className="mx-auto shadow-md p-6 md:p-8 bg-white dark:bg-gray-800"
    >
      <Typography
        variant="h2"
        className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6"
      >
        معلومات الحساب
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <Typography className="text-xs font-medium text-gray-500 dark:text-gray-400">
            الاسم الكامل
          </Typography>
          {isEditing ? (
            <Input
              {...register("name")}
              className="mt-2"
              disabled={loading}
            />
          ) : (
            <Typography className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-2">
              {user.name}
            </Typography>
          )}
        </div>

        {/* Email */}
        <div>
          <Typography className="text-xs font-medium text-gray-500 dark:text-gray-400">
            البريد الإلكتروني
          </Typography>
          {isEditing ? (
            <Input
              type="email"
              {...register("email")}
              className="mt-2"
              disabled={loading}
            />
          ) : (
            <Typography className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-2">
              {user.email}
            </Typography>
          )}
        </div>

        {/* Phone */}
        <div>
          <Typography className="text-xs font-medium text-gray-500 dark:text-gray-400">
            رقم الهاتف
          </Typography>
          {isEditing ? (
            <Input
              {...register("phone")}
              className="mt-2"
              disabled={loading}
            />
          ) : (
            <Typography className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-2">
              {user.phone}
            </Typography>
          )}
        </div>

        {/* isVisible */}
        <div>
          <Typography className="text-xs font-medium text-gray-500 dark:text-gray-400">
            عرض حسابي في كبار المحسنين
          </Typography>
          {isEditing ? (
            <label className="mt-2 flex items-center gap-2 cursor-pointer">
              <Checkbox
                {...register("isVisible")}
                className="form-checkbox rounded border-gray-300 text-primaryColor"
                defaultChecked={user?.isVisible}
              />
              <span className="text-sm text-gray-700 dark:text-gray-200">
                مرئي
              </span>
            </label>
          ) : (
            <Typography className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-2">
              {user.isVisible ? "مرئي" : "غير مرئي"}
            </Typography>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sm:col-span-2 flex gap-4 mt-6">
          {isEditing ? (
            <>
              <Button
                type="submit"
                className="bg-primaryColor text-white shadow-md"
                disabled={loading || !isDirty}
              >
                حفظ التغييرات
              </Button>
              <Button type="button" variant="outlined" onClick={handleCancel}>
                إلغاء
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="bg-primaryColor text-white shadow-md"
              onClick={() => setIsEditing(true)}
            >
              تعديل المعلومات
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
