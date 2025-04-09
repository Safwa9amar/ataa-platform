import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Checkbox } from "@material-tailwind/react";

const Step8 = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4">
      {/* Commitment to Transparency */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <label className="flex items-center space-x-2">
          <Checkbox
            {...register("commitmentTransparency", {
              required: "الرجاء الإقرار بالالتزام بالشفافية",
            })}
            className="form-checkbox text-teal-600"
          />
          <span>الالتزام بالشفافية</span>
        </label>
        {errors.commitmentTransparency && (
          <p className="text-red-500 text-sm">
            {errors.commitmentTransparency.message}
          </p>
        )}
      </motion.div>

      {/* Periodic Reporting Commitment */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <label className="flex items-center space-x-2">
          <Checkbox

            {...register("commitmentReporting", {
              required: "الرجاء التعهد بتقديم تقارير دورية حول استخدام الأموال وأثرها",
            })}
            className="form-checkbox text-teal-600"
          />
          <span>التعهد بتقديم تقارير دورية حول استخدام الأموال وأثرها</span>
        </label>
        {errors.commitmentReporting && (
          <p className="text-red-500 text-sm">
            {errors.commitmentReporting.message}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Step8;
