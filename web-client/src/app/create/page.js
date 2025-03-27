"use client";
import { useAlgeriaCitiesContext } from "@/context/AlgeriaCitiesContext";
import { useCredentials } from "@/context/CredentialsContext";
import { useFieldCategoryContext } from "@/context/FieldCategoryContext";
import { createDonationOpportunity } from "@/services/donationOpportunityService";
import React, { useState } from "react";

const CreateDonationOpportunityPage = () => {
  const { wilayas } = useAlgeriaCitiesContext();
  const { fields, categories } = useFieldCategoryContext();
  const { userToken } = useCredentials();
  const [formData, setFormData] = useState({
    title: "تبرع غذائي للأسر المحتاجة", // Fake title
    type: "normalOpportunity", // القيمة الافتراضية من التعداد
    overview: "فرصة تبرع للمساعدة في توفير الطعام للعائلات في حاجة للمساعدة.", // Fake overview
    description:
      "نهدف من خلال هذه الفرصة إلى جمع تبرعات لشراء المواد الغذائية الأساسية للأسر المحتاجة في المناطق النائية.", // Fake description
    ImplementingPartner: "جمعية الأمل الخيرية", // Fake Implementing Partner
    totalDonation: "50000", // Fake total donation
    requiredAmount: "50000", // Fake required amount
    numberBeneficiaries: 200, // Fake number of beneficiaries
    cardImage: "https://example.com/food-donation-image.jpg", // Fake image URL
    wilayaId: "01", // Fake Wilaya ID
    fieldId: "2", // Fake Field ID
    chrityId: "", // Fake Charity ID
    categoryId: "5", // Fake Category ID
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await createDonationOpportunity(formData, userToken);
    } catch (err) {
      console.log("error", err, err.message);
      setError(err.message || "فشل في إنشاء فرصة التبرع.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          إنشاء فرصة تبرع
        </h1>
        {error && (
          <div className="text-red-500 bg-red-100 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                العنوان
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                النوع
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="normalOpportunity">فرصة عادية</option>
                <option value="storeOpportunity">فرصة متجر</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                نظرة عامة
              </label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                required
                rows="3"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                الوصف
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                الشريك المنفذ
              </label>
              <input
                type="text"
                name="ImplementingPartner"
                value={formData.ImplementingPartner}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                المبلغ المطلوب
              </label>
              <input
                type="text"
                name="requiredAmount"
                value={formData.requiredAmount}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                إجمالي التبرعات
              </label>
              <input
                type="text"
                name="totalDonation"
                value={formData.totalDonation}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                عدد المستفيدين
              </label>
              <input
                type="number"
                name="numberBeneficiaries"
                value={formData.numberBeneficiaries}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                رابط صورة البطاقة
              </label>
              <input
                type="text"
                name="cardImage"
                value={formData.cardImage}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                معرف الولاية
              </label>
              {wilayas && (
                <select
                  name="wilayaId"
                  value={formData.wilayaId}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  {wilayas.map((wilaya) => (
                    <option key={wilaya.id} value={wilaya.wilaya_code}>
                      {wilaya.wilaya_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                معرف المجال
              </label>
              {fields && (
                <select
                  name="fieldId"
                  value={formData.fieldId}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.ar_title}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                معرف الجمعية الخيرية
              </label>
              <input
                type="text"
                name="chrityId"
                value={formData.chrityId}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                معرف الفئة
              </label>
              {categories && (
                <select
                  name="catigoryId"
                  value={formData.catigoryId}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.ar_title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md"
          >
            {isSubmitting ? "جاري الإرسال..." : "إنشاء الفرصة"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDonationOpportunityPage;
