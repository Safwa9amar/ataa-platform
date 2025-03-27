"use client";
import React, { useState } from "react";
import Button from "@/components/UI/Button";
import Image from "next/image";
import { createAppointment } from "@/services/appointmentsServices";
import { useCredentials } from "@/context/CredentialsContext";
import Swal from "sweetalert2";
import validator from "validator";
import { useRouter } from "next/navigation";

export default function BookAppointment({ searchParams }) {
  const { user, userToken, isLoggedIn } = useCredentials();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب.";
    } else if (!validator.isEmail(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح.";
    }

    // Phone validation (10+ digits for this example)
    if (!formData.phone) {
      newErrors.phone = "رقم الهاتف مطلوب.";
    } else if (!validator.isMobilePhone(formData.phone, "ar-DZ")) {
      newErrors.phone =
        "رقم الهاتف يجب أن يتكون من 10 ارقام ويبدا ب 06 او 05 او 07.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      Swal.fire({
        title: "خطأ! يجب تسجيل الدخول أولاً",
        text: "يرجى تسجيل الدخول لحجز موعد.",
        icon: "error",
        confirmButtonText: "حسنًا",
      }).then(({ isConfirmed }) => {
        isConfirmed && router.push("/account/login");
      });

      return;
    }

    // Validate form
    if (!validate()) {
      Swal.fire({
        title: "خطأ في المدخلات!",
        text: "يرجى تصحيح الحقول قبل الإرسال.",
        icon: "warning",
        confirmButtonText: "حسنًا",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createAppointment(
        {
          ...formData,
          locationLink: "",
          campaignId: searchParams.id,
          userId: user.id,
          type: "USERCAMPAIGN",
        },
        userToken
      );

      Swal.fire({
        title: "نجاح!",
        text: "تم حجز الموعد بنجاح! سنتواصل معك قريبًا.",
        icon: "success",
        confirmButtonText: "حسنًا",
      });

      setFormData({ email: "", phone: "" });
    } catch (error) {
      Swal.fire({
        title: "خطأ!",
        text: error || "حدث خطأ أثناء حجز الموعد.",
        icon: "error",
        confirmButtonText: "إغلاق",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="container mx-auto p-4 md:min-h-[50vh] flex flex-wrap items-center justify-around"
    >
      <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          <p>{searchParams.title}</p>
          حجز موعد للتبرع
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } dark:bg-gray-700 dark:text-gray-200 focus:ring focus:ring-indigo-300`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Input */}
          <div>
            <label
              htmlFor="phone"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              رقم الهاتف
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${
                errors.phone
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } dark:bg-gray-700 dark:text-gray-200 focus:ring focus:ring-indigo-300`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            loading={isSubmitting}
            type="submit"
            color="indigo"
            className="w-full rounded-full font-bold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جارٍ الحجز..." : "حجز الموعد"}
          </Button>
        </form>
      </div>
      <Image
        className="hidden md:block"
        src={"/images/hamaltPG.png"}
        width={300}
        height={500}
      />
    </div>
  );
}
