import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Input } from "@material-tailwind/react";
import { useEffect } from "react";

const Step3 = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const targetType = watch("targetType");
  return (
    <div className="space-y-6 grid grid-cols-[500px] mx-auto" dir="rtl">
      <motion.div
        key="targetType"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <label className="block text-sm font-medium text-gray-700">
          مبلغ مالي أو عدد وحدات مستهدف
        </label>
        <select
          {...register("targetType", {
            required: "الرجاء تحديد المبلغ المطلوب",
          })}
          className={`mt-1 block w-full border rounded-md p-2 ${
            errors.targetType ? "border-red-500" : "border-borderColor"
          }`}
        >
          <option value="">اختر</option>
          <option value="MONEY">المبلغ المالي المستهدف جمعها</option>
          <option value="GOODS">عدد الوحدات المستهدف جمعها</option>
        </select>
        {errors.targetType && (
          <span className="text-red-500 text-sm">
            {errors.targetType?.message}
          </span>
        )}
      </motion.div>

      {targetType === "MONEY" && (
        <motion.div
          key="targetAmount"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Input
            {...register("targetAmount", {
              required: "الرجاء تحديد المبلغ المطلوب",
              max: {
                value: 100000000,
                message: "الحد الأقصى 10 مليون دينار جزائري",
              },
            
            })}
            variant="standard"
            color={errors.targetAmount ? "red" : "teal"}
            placeholder="أدخل المبلغ المطلوب"
            label="المبلغ المطلوب"
          />
          {errors.targetAmount && (
            <p className="text-red-500 text-sm">
              {errors.targetAmount.message}
            </p>
          )}
        </motion.div>
      )}

      {targetType === "GOODS" && (
        <motion.div
          key="goods"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <Input
            {...register("targetAmount", {
              required: "الرجاء تحديد عدد الوحدات المطلوب جمعها",
            })}
            variant="outlined"
            color={errors.targetAmount ? "red" : "teal"}
            placeholder="أدخل عدد الوحدات المطلوب جمعها"
            label="عدد الوحدات المطلوب جمعها"
          />
          {errors.targetAmount && (
            <p className="text-red-500 text-sm">
              {errors.targetAmount.message}
            </p>
          )}

          <Input
            {...register("unitPrice", {
              required: "سعر الوحدة مطلوب",
            })}
            variant="outlined"
            color={errors.unitPrice ? "red" : "teal"}
            placeholder="أدخل سعر الوحدة بــ (دج)"
            label="سعر الوحدة بــ (دج)"
          />
          {errors.unitPrice && (
            <p className="text-red-500 text-sm">{errors.unitPrice.message}</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Step3;
