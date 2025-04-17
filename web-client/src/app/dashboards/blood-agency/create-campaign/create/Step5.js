import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Input, Checkbox } from "@material-tailwind/react";
import CONSTANTS from "@/config/constants";

const donationTypes = ["دم كامل", "بلازما", "صفائح دموية"];
const targetGroups = ["الشباب", "عامة الناس", "العاملين في قطاع الصحة"];

const Step5 = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6 grid grid-cols-[500px] mx-auto" dir="rtl">
      <h1 className="text-xl font-bold">معلومات إضافية</h1>

      {/* نوع التبرع */}
      <motion.div
        key="donationType"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          نوع التبرع المطلوب
        </label>
        <select
          {...register("donationType", {
            required: "يرجى تحديد نوع التبرع",
          })}
          className={`mt-1 block w-full border rounded-md p-2 ${
            errors.donationType ? "border-red-500" : "border-borderColor"
          }`}
        >
          <option value="">اختر نوع التبرع</option>
          {donationTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.donationType && (
          <p className="text-red-500 text-sm">{errors.donationType.message}</p>
        )}
      </motion.div>
      {/* mostNeededBlood */}
      <motion.div
        key="mostNeededBlood"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الزمرة الأكثر احتياجا
        </label>
        <select
          {...register("mostNeededBlood", {
            required: "يرجى تحديد نوع التبرع",
          })}
          className={`mt-1 block w-full border rounded-md p-2 ${
            errors.mostNeededBlood ? "border-red-500" : "border-borderColor"
          }`}
        >
          <option value="">اختر </option>
          {CONSTANTS.BLOOD_TYPES_WITH_NAME.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.mostNeededBlood && (
          <p className="text-red-500 text-sm">
            {errors.mostNeededBlood.message}
          </p>
        )}
      </motion.div>

      <motion.div
        key="targetUnits"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Input
          variant="outlined"
          label="عدد الوحدات المستهدفة"
          {...register("targetUnits", {
            required: "يرجى تحديد نوع التبرع",
            valueAsNumber: true,
          })}
          className={`mt-1 block w-full border rounded-md p-2 ${
            errors.targetUnits ? "border-red-500" : "border-borderColor"
          }`}
        />

        {errors.targetUnits && (
          <p className="text-red-500 text-sm">{errors.targetUnits.message}</p>
        )}
      </motion.div>

      {/* الفئة المستهدفة */}
      <motion.div
        key="targetGroups"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الفئات المستهدفة
        </label>
        {targetGroups.map((group) => (
          <div key={group}>
            <Checkbox
              label={group}
              value={group}
              {...register("targetGroups", {
                required: "يرجى تحديد الفئات المستهدفة",
              })}
              color="teal"
            />
          </div>
        ))}
        {errors.targetGroups && (
          <p className="text-red-500 text-sm">{errors.targetGroups.message}</p>
        )}
      </motion.div>
    </div>
  );
};

export default Step5;
