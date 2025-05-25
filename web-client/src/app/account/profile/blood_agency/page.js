"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Input,
  Button,
} from "@material-tailwind/react";
import { useCredentials } from "@/context/CredentialsContext";
import { toast } from "react-toastify";

function AccountPage() {
  const { user, updateUser, loading } = useCredentials();

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  });

  const [originalData, setOriginalData] = useState(formData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });
    setOriginalData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  }, [user]);

  const handleInputChange = () => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateUser(formData);
      setOriginalData(formData);
      setIsEditing(false);
      toast.success("تم حفظ التغييرات بنجاح");
    } catch (err) {
      toast.error("حدث خطأ أثناء تحديث المعلومات");
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  return (
    <Card dir="rtl" className="mx-auto shadow-sm p-6 md:p-8 max-w-4xl bg-inherit">
      <Typography variant="h2" className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 ">
        معلومات الحساب
      </Typography>

      <div className="space-y-10">
        {/* Full Name */}
        <Field label="الاسم الكامل" name="name" value={formData.name} onChange={handleInputChange} editable={isEditing} loading={loading} />

        {/* Email */}
        <Field label="البريد الإلكتروني" name="email" type="email" value={formData.email} onChange={handleInputChange} editable={isEditing} loading={loading} />

        {/* Phone */}
        <Field label="رقم الهاتف" name="phone" value={formData.phone} onChange={handleInputChange} editable={isEditing} loading={loading} />
      </div>

      {/* Actions */}
      <div className="mt-8">
        {isEditing ? (
          <>
            <Button color="teal" className="rounded-full px-6" onClick={handleSave} disabled={loading}>
              حفظ التغييرات
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              إلغاء
            </Button>
          </>
        ) : (
          <Button color="teal" className="rounded-full px-6" onClick={() => setIsEditing(true)}>
            تعديل المعلومات
          </Button>
        )}
      </div>
    </Card>
  );
}

function Field({ label, name, value, onChange, editable, loading, type = "text" }) {
  return (
    <div>
      <Typography className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</Typography>
      {editable ? (
        <Input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={loading}
          className="bg-white dark:bg-gray-700"
        />
      ) : (
        <Typography className="text-base font-semibold text-gray-900 dark:text-white">{value || "—"}</Typography>
      )}
    </div>
  );
}

export default AccountPage;
