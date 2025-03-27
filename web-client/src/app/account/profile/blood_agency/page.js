"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Input,
  Button,
  Checkbox,
} from "@material-tailwind/react";
import { useCredentials } from "@/context/CredentialsContext";
import { Flip, toast } from "react-toastify";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";

function page() {
  const { user, updateUser, loading, userToken } = useCredentials(); // Integrated `updateUser` and `loading`
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  const [originalData, setOriginalData] = useState(formData); // To track original values for canceling changes
  const [isEditing, setIsEditing] = useState(false);

  // Handle input change for editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle direct update of the user data without a form submission
  const handleUpdate = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Call updateUser directly to save the changes immediately
    const updatedData = { ...formData, [field]: value };
    updateUser(updatedData); // Assuming `updateUser` directly updates user data
  };

  // Reset form data to the original values when canceling edit
  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  // Set the original data when the user information is loaded
  useEffect(() => {
    setOriginalData(formData); // Update original data when user info changes
  }, [user]);

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

      {/* Account Information Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <Typography className="text-xs sm:text-sm md:text-base font-medium text-gray-500 dark:text-gray-400">
            الاسم الكامل
          </Typography>
          {isEditing ? (
            <Input
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange(e)}
              className="mt-2"
              disabled={loading} // Disable input during loading
            />
          ) : (
            <Typography className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200">
              {user.name}
            </Typography>
          )}
        </div>

        {/* Email */}
        <div>
          <Typography className="text-xs sm:text-sm md:text-base font-medium text-gray-500 dark:text-gray-400">
            البريد الإلكتروني
          </Typography>
          {isEditing ? (
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange(e)}
              className="mt-2"
              disabled={loading} // Disable input during loading
            />
          ) : (
            <Typography className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200">
              {user.email}
            </Typography>
          )}
        </div>

        {/* Phone */}
        <div>
          <Typography className="text-xs sm:text-sm md:text-base font-medium text-gray-500 dark:text-gray-400">
            رقم الهاتف
          </Typography>
          {isEditing ? (
            <Input
              name="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange(e)}
              className="mt-2"
              disabled={loading} // Disable input during loading
            />
          ) : (
            <Typography className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200">
              {user.phone}
            </Typography>
          )}
        </div>

        {/* Phone */}
        <div>
          <Typography className="text-xs sm:text-sm md:text-base font-medium text-gray-500 dark:text-gray-400">
            عرض حسابي في كبار المحسنين
          </Typography>
          {isEditing ? (
            <Checkbox
              defaultChecked={user.isVisible}
              color="indigo"
              name="isVisible"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isVisible: e.target.checked,
                }))
              }
              className="mt-2"
              disabled={loading} // Disable input during loading
            />
          ) : (
            <Typography className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200">
              {user.isVisible ? "مرئي" : "مخفي"}
            </Typography>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        {isEditing ? (
          <>
            <Button
              type="button"
              className="bg-primaryColor text-white shadow-md"
              disabled={loading} // Disable button during loading
              onClick={() => updateUser(formData)} // Save changes on click
            >
              حفظ التغييرات
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={handleCancel} // Cancel changes on click
            >
              إلغاء
            </Button>
          </>
        ) : (
          <Button
            type="button"
            onClick={() => setIsEditing(true)} // Enable edit mode
            className="bg-primaryColor text-white shadow-md"
          >
            تعديل المعلومات
          </Button>
        )}
      </div>
    </Card>
  );
}

export default page;
