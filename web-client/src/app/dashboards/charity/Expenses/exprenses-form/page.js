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
  CreditCardIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { createExpense } from "@/services/ExpenseCharityServices";
import { useCredentials } from "@/context/CredentialsContext";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function ExpenseEntryForm() {
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
      await createExpense(data, userToken);
      Swal.fire({
        icon: "success",
        title: "تم حفظ البيانات بنجاح",
      });
      reset();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ ما يرجى اعادة المحاولة",
        text: error.message,
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
          {/* Expense Type */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative flex flex-col"
          >
            <label htmlFor="expenseType">نوع النفقات</label>
            <CreditCardIcon className="h-5 w-5 absolute right-3 top-9" />
            <select
              className="border border-borderColor pr-10 pl-5 py-2 rounded-md focus:outline-none focus:border-teal-400 bg-transparent"
              {...register("expenseType", { required: true })}
              label="نوع النفقات"
              size="lg"
              error={!!errors.expenseType}
            >
              <option value="OPERATIONAL">تشغيلية</option>
              <option value="NON_OPERATIONAL">غير تشغيلية</option>
              <option value="ADMINISTRATIVE">إدارية</option>
            </select>
            {errors.expenseType && (
              <Typography variant="small" color="red" className="mt-1">
                هذا الحقل مطلوب
              </Typography>
            )}
          </motion.div>

          {/* Expense Amount */}
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
              color="teal"
            />
            {errors.amount && (
              <Typography variant="small" color="red" className="mt-1">
                يرجى إدخال مبلغ صحيح
              </Typography>
            )}
          </motion.div>

          {/* Expense Date */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Input
              {...register("expenseDate", { required: true })}
              type="date"
              label="تاريخ الدفع"
              size="lg"
              error={!!errors.expenseDate}
              color="teal"
            />
            {errors.expenseDate && (
              <Typography variant="small" color="red" className="mt-1">
                يرجى تحديد تاريخ صحيح
              </Typography>
            )}
          </motion.div>

          {/* Beneficiary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Input
              {...register("beneficiary", { required: true })}
              type="text"
              label="الجهة المستفيدة أو المستلمة"
              size="lg"
              error={!!errors.beneficiary}
              color="teal"
            />
            {errors.beneficiary && (
              <Typography variant="small" color="red" className="mt-1">
                يرجى إدخال الجهة المستفيدة
              </Typography>
            )}
          </motion.div>
        </div>

        {/* Additional Notes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Textarea
            {...register("notes")}
            label="ملاحظات إضافية"
            size="lg"
            color="teal"
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