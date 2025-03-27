"use client";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input, Typography } from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import ToggleButtonGroup from "@/components/UI/ToggleButtonGroup";
import CONSTANTS from "@/config/constants";
export default function Step3() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const getButtonStyles = (condition) => ({
    className: `${
      condition
        ? "text-white bg-red-500"
        : "bg-white dark:bg-gray-700 text-textColor"
    } font-ElMessiri flex items-center gap-2`,
  });

  return (
    <motion.div
      className="space-y-4 grid md:grid-cols-[650px]"
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Typography className="text-center" variant="lead">
        معلومات الحملة
      </Typography>

      {/* حالة الحملة */}
      <AnimatePresence>
        <motion.div
          key="campaignStatus"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm mb-4">حالة الحملة</p>
          <select
            className="w-full border border-borderColor p-2 rounded-md"
            {...register("campaignStatus", {
              required: "يرجى تحديد حالة الحملة",
            })}
          >
            <option value="">اختر الحالة</option>
            <option value="URGENT">مستعجلة</option>
            <option value="NOT_URGENT">غير مستعجلة</option>
          </select>
          {errors.campaignStatus && (
            <p className="text-red-500 text-sm">
              {errors.campaignStatus.message}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* عدد المستفيدين */}
      <AnimatePresence>
        <motion.div
          key="numOfBeneficiaries"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ delay: 0.3 }}
        >
          <Input
            color="amber"
            type="number"
            label="عدد المستفيدين"
            {...register("numOfBeneficiaries", {
              valueAsNumber: true,
              required: "عدد المستفيدين مطلوب",
            })}
          />
          {errors.numOfBeneficiaries && (
            <p className="text-red-500 text-sm">
              {errors.numOfBeneficiaries.message}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        <motion.div
          key="numOfBeneficiaries"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ delay: 0.4 }}
        >
          <Input
            color="amber"
            type="number"
            label="عدد الوحدات المستهدفة"
            {...register("numberOfUnits", {
              valueAsNumber: true,
              required: "عدد الوحدات المستهدفة مطلوب",
            })}
          />
          {errors.numberOfUnits && (
            <p className="text-red-500 text-sm">
              {errors.numberOfUnits.message}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* تحديد الزمرة الدموية */}
      <AnimatePresence>
        <motion.div
          key="selectedBloodType"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ delay: 0.5 }}
        >
          <Controller
            name="selectedBloodType"
            control={control}
            rules={{
              required: "يرجى تحديد الزمرة المطلوبة",
            }}
            render={({ field }) => (
              <ToggleButtonGroup
                {...field}
                setSelectedOption={field.onChange}
                options={{
                  choices: CONSTANTS.BLOOD_TYPES_WITH_NAME,
                }}
                getButtonStyles={getButtonStyles}
                selectedOption={field.value}
              />
            )}
          />
          {errors.selectedBloodType && (
            <p className="text-red-500 text-sm">
              {errors.selectedBloodType.message}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* اسم الجهة المتكفلة بالحملة */}
      <AnimatePresence>
        <motion.div
          key="bloodBankName"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ delay: 0.6 }}
        >
          <Input
            color="amber"
            label=" اسم البنك/المصحة الخاصة/المستشفى العمومي المتكفل بالحملة"
            {...register("bloodBankName", {
              required: "اسم الجهة المتكفلة بالحملة مطلوب",
            })}
          />
          {errors.bloodBankName && (
            <p className="text-red-500 text-sm">
              {errors.bloodBankName.message}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* رابط الموقع على خرائط غوغل */}
      <AnimatePresence>
        <motion.div
          key="googleMapLink"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ delay: 0.7 }}
        >
          <Input
            {...register("googleMapLink", {
              required: "رابط الموقع على خرائط غوغل مطلوب",
            })}
            color="amber"
            type="text"
            label="رابط الموقع على خرائط غوغل"
          />
          {errors.googleMapLink && (
            <p className="text-red-500 text-sm">
              {errors.googleMapLink.message}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
