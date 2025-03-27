"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Input,
  Textarea,
  Button,
  Spinner,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { createIncome } from "@/services/IncomeCharityServices";
import { useCredentials } from "@/context/CredentialsContext";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function IncomeEntryForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { userToken } = useCredentials();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let res = await createIncome(data, userToken);
      Swal.fire({
        icon: "success",
        title: "تم حفظ البيانات بنجاح",
      });
      reset();
      // router.back();
    } catch {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ ما يرجى اعادة المحاولة",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-transparent p-10 shadow-lg rounded-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-5">
          {/* Income Source */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative flex flex-col"
          >
            <label htmlFor="source">مصدر الايرادات</label>
            <CurrencyDollarIcon className="h-5 w-5 absolute right-3 top-9 " />
            <select
              className="border border-borderColor pr-10 pl-5  py-2 rounded-md focus:outline-none focus:border-blue-500"
              {...register("source", { required: true })}
              label="مصدر الإيرادات"
              size="lg"
              error={!!errors.source}
            >
              <option value="SALES">مبيعات</option>
              <option value="GOVERNMENT_SUPPORT">دعم حكومي</option>
              <option value="GRANT">منح</option>
              <option value="OTHER">أخرى</option>
            </select>
            {errors.source && (
              <Typography variant="small" color="red" className="mt-1">
                هذا الحقل مطلوب
              </Typography>
            )}
          </motion.div>

          {/* Income Amount */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Input
              {...register("amount", { required: true, min: 1 })}
              type="number"
              label="المبلغ"
              size="lg"
              error={!!errors.amount}
            />
            {errors.amount && (
              <Typography variant="small" color="red" className="mt-1">
                يرجى إدخال مبلغ صحيح
              </Typography>
            )}
          </motion.div>

          {/* Income Date */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Input
              {...register("receiptDate", { required: true })}
              type="date"
              label="تاريخ الاستلام"
              size="lg"
              error={!!errors.receiptDate}
            />
            {errors.receiptDate && (
              <Typography variant="small" color="red" className="mt-1">
                يرجى تحديد تاريخ صحيح
              </Typography>
            )}
          </motion.div>
        </div>

        {/* Additional Notes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Textarea
            {...register("notes")}
            label="ملاحظات إضافية"
            size="lg"
            className="min-h-[120px]"
          />
        </motion.div>

        {/* Form Actions */}
        <CardFooter className="flex justify-between p-0 pt-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="text"
              className="flex items-center gap-2"
              onClick={() => router.back()}
            >
              <ArrowLeftIcon className="h-5 w-5" />
              رجوع
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              type="submit"
              color="green"
              disabled={isSubmitting}
              className="flex items-center gap-2 font-ElMessiri rounded-full"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="h-4 w-4" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <CheckIcon className="h-5 w-5" />
                  حفظ ومتابعة
                </>
              )}
            </Button>
          </motion.div>
        </CardFooter>
      </form>
    </motion.div>
  );
}