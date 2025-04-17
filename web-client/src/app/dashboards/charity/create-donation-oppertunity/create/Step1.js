import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import CONSTANTS from "@/config/constants";
import { useFieldCategoryContext } from "@/context/FieldCategoryContext";

export default function Step1() {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext();
  const {
    fields,
    loading: loadingFields,
    setSelectedField,
    categories,
  } = useFieldCategoryContext();
  const type = watch("type");
  const field = watch("field");
  const subCategory = categories.find(
    (cat) => cat.id === watch("category")
  )?.title;

  useEffect(() => {
    setSelectedField(field);
  }, [field]);

  useEffect(() => {
    setValue("subCategory", subCategory);
  }, [subCategory]);

  const renderField = (field) => {
    switch (field.type) {
      case "select":
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-gray-700 mb-2">{field.label}</label>
            <select
              {...register(field.name, { required: `${field.label} مطلوب` })}
              className="w-full p-2 border rounded"
            >
              <option value="">اختر {field.label}</option>
              {field.data.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        );

      case "text":
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-gray-700 mb-2">{field.label}</label>
            <input
              type="text"
              {...register(field.name, { required: `${field.label} مطلوب` })}
              className="w-full p-2 border rounded"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        );

      case "number":
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-gray-700 mb-2">{field.label}</label>
            <input
              type="number"
              {...register(field.name, {
                required: `${field.label} مطلوب`,
                min: { value: 0, message: "يجب أن يكون الرقم موجبًا" },
              })}
              className="w-full p-2 border rounded"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-gray-700 mb-2">{field.label}</label>
            <textarea
              {...register(field.name, { required: `${field.label} مطلوب` })}
              className="w-full p-2 border rounded"
              rows={4}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        );

      case "month":
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-gray-700 mb-2">{field.label}</label>
            <input
              type="month"
              {...register(field.name, { required: `${field.label} مطلوب` })}
              className="w-full p-2 border rounded"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <motion.div
      className="space-y-5 grid grid-cols-[550px]"
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.select
        className={`w-full border p-2 rounded-md ${
          errors.field && "border-red-500"
        }`}
        {...register("field", { required: "الرجاء اختيار الصنف" })}
        whileHover={{ scale: 1.05 }}
        whileFocus={{ scale: 1.05 }}
      >
        <option value="">اختر الصنف</option>
        {fields.map((f) => (
          <option key={f.id} value={f.id}>
            {f.ar_title}
          </option>
        ))}
      </motion.select>
      {errors.field && (
        <p className="text-red-500 text-sm">{errors.field.message}</p>
      )}
      <AnimatePresence>
        {categories.length > 0 && (
          <motion.select
            disabled={loadingFields}
            className={`w-full border p-2 rounded-md ${
              errors.category && "border-red-500"
            }`}
            {...register("category", { required: "الرجاء تحديد الفئة" })}
            whileHover={{ scale: 1.05 }}
            whileFocus={{ scale: 1.05 }}
          >
            <option value="">اختر الفئة</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.ar_title}
              </option>
            ))}
          </motion.select>
        )}
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </AnimatePresence>

      <motion.select
        className={`w-full border p-2 rounded-md ${
          errors.donationScoop && "border-red-500"
        }`}
        {...register("donationScoop", { required: "الرجاء تحديد المجال" })}
        whileHover={{ scale: 1.05 }}
        whileFocus={{ scale: 1.05 }}
      >
        <option value="">اختر المجال</option>
        {CONSTANTS.DONATION_SCOOP.map((scoop) => (
          <option key={scoop.value} value={scoop.value}>
            {scoop.name}
          </option>
        ))}
      </motion.select>
      {errors.donationScoop && (
        <p className="text-red-500 text-sm">{errors.donationScoop.message}</p>
      )}
      {CONSTANTS.subcategoryMap[subCategory] &&
        CONSTANTS.subcategoryMap[subCategory].map((field) =>
          renderField(field)
        )}
    </motion.div>
  );
}
