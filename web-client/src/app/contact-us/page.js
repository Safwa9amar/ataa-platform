"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validator from "validator";
import { Button } from "@material-tailwind/react";

// وظيفة للتحقق من البريد الإلكتروني باستخدام `validator`
const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    return "يرجى إدخال بريد إلكتروني صحيح";
  }
  return true;
};

export default function ContactPage() {
  const [loading, setLoading] = useState(false); // حالة تحميل
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // لإعادة تعيين القيم
  } = useForm();

  // وظيفة محاكاة إرسال الرسالة
  const onSubmit = (data) => {
    setLoading(true); // تفعيل حالة التحميل

    // محاكاة إرسال البيانات (يمكنك استبدالها باتصال حقيقي بـ API)
    setTimeout(() => {
      // محاكاة استجابة بعد 2 ثانية
      setLoading(false); // إيقاف حالة التحميل

      // إعادة تعيين النموذج بعد النجاح
      reset();

      // محاكاة عرض SweetAlert2 عند النجاح
      Swal.fire({
        icon: "success",
        title: "تم إرسال الرسالة بنجاح!",
        text: "سوف يتم الرد عليك قريباً.",
        confirmButtonText: "موافق",
      });

      // عرض إشعار باستخدام Toastify
      toast.success("تم إرسال الرسالة بنجاح!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      data; // يمكنك تسجيل البيانات أو معالجتها هنا
    }, 2000); // محاكاة تأخير 2 ثانية
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Email Input */}
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          بريدك الإلكتروني
        </label>
        <input
          type="email"
          id="email"
          {...register("email", {
            required: "البريد الإلكتروني مطلوب",
            validate: validateEmail,
          })}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500 dark:shadow-sm-light"
          placeholder="name@flowbite.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Subject Input */}
      <div>
        <label
          htmlFor="subject"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          الموضوع
        </label>
        <input
          type="text"
          id="subject"
          {...register("subject", { required: "الموضوع مطلوب" })}
          className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500 dark:shadow-sm-light"
          placeholder="دعنا نعرف كيف يمكننا مساعدتك"
        />
        {errors.subject && (
          <p className="text-red-500 text-sm">{errors.subject.message}</p>
        )}
      </div>

      {/* Message Input */}
      <div className="sm:col-span-2">
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
        >
          رسالتك
        </label>
        <textarea
          id="message"
          rows="6"
          {...register("message", { required: "الرسالة مطلوبة" })}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
          placeholder="اكتب تعليقك هنا..."
        ></textarea>
        {errors.message && (
          <p className="text-red-500 text-sm">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        loading={loading} // تعطيل الزر أثناء التحميل
        className={`py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-teal-600 sm:w-fit hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-700 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
      </Button>
      {/* Container for Toastify notifications */}
      <ToastContainer />
    </form>
  );
}
