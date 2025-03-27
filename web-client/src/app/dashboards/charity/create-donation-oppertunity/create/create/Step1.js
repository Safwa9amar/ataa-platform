import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import CONSTANTS from "@/config/constants";
import { useFieldCategoryContext } from "@/context/FieldCategoryContext";

export default function Step1() {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext();
  const {
    fields,
    loading: loadingFields,
    setSelectedField,
    categories,
  } = useFieldCategoryContext();

  const field = watch("field");

  useEffect(() => {
    setSelectedField(field);
  }, [field]);

  return (
    <motion.div
      className="space-y-5 grid grid-cols-[350px]"
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
      <motion.select
        className={`w-full border p-2 rounded-md ${
          errors.type && "border-red-500"
        }`}
        {...register("type", { required: "الرجاء تحديد نوع الفرصة" })}
        whileHover={{ scale: 1.05 }}
        whileFocus={{ scale: 1.05 }}
      >
        <option value="">اختر نوع الفرصة</option>
        <option value="storeOpportunity">فرصة متجر التبرع</option>
        <option value="normalOpportunity">فرصة تبرع المنصة</option>
      </motion.select>
      {errors.type && (
        <p className="text-red-500 text-sm">{errors.type.message}</p>
      )}
    </motion.div>
  );
}
