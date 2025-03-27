"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Input,
  Textarea,
  Button,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { createInvoice } from "@/services/InvoiceCharityServices";
import { useCredentials } from "@/context/CredentialsContext";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function InvoiceTrackingForm() {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
    watch,
  } = useForm();
  const router = useRouter();
  const { userToken } = useCredentials();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createInvoice(data, userToken);
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

  useEffect(() => {
    watch();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-transparent p-10 shadow-lg rounded-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-5">
          {/* Invoice Number */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Input
              {...register("invoiceNumber", { required: true })}
              type="text"
              label="رقم الفاتورة"
              size="lg"
              variant="outlined"
              error={!!errors.invoiceNumber}
            />
            {errors.invoiceNumber && (
              <Typography variant="small" color="red" className="mt-1">
                هذا الحقل مطلوب
              </Typography>
            )}
          </motion.div>

          {/* Payment Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative flex flex-col"
          >
            <label htmlFor="paymentStatus">حالة الدفع</label>
            <CheckBadgeIcon className="h-5 w-5 absolute right-3 top-9" />
            <select
              className="border border-borderColor pr-10 bg-transparent pl-5 py-2 rounded-md focus:outline-none focus:border-blue-500"
              {...register("paymentStatus", { required: true })}
              label="حالة الدفع"
              size="lg"
              error={!!errors.paymentStatus}
            >
              <option value="PAID">تم الدفع</option>
              <option value="PENDING">مؤجل</option>
              <option value="UNPAID">لم يتم الدفع</option>
            </select>
            {errors.paymentStatus && (
              <Typography variant="small" color="red" className="mt-1">
                هذا الحقل مطلوب
              </Typography>
            )}
          </motion.div>

          {/* Issuer/Beneficiary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Input
              {...register("issuerBeneficiary", { required: true })}
              type="text"
              label="الجهة المصدرة أو المستفيدة"
              size="lg"
              error={!!errors.issuerBeneficiary}
            />
            {errors.issuerBeneficiary && (
              <Typography variant="small" color="red" className="mt-1">
                يرجى إدخال الجهة
              </Typography>
            )}
          </motion.div>

          {/* Invoice Amount */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Input
              {...register("invoiceAmount", { required: true, min: 1 })}
              type="number"
              label="مبلغ الفاتورة"
              size="lg"
              error={!!errors.invoiceAmount}
            />
            {errors.invoiceAmount && (
              <Typography variant="small" color="red" className="mt-1">
                يرجى إدخال مبلغ صحيح
              </Typography>
            )}
          </motion.div>

          {/* Dates */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <Input
                {...register("issueDate", { required: true })}
                type="date"
                label="تاريخ الإصدار"
                size="lg"
                error={!!errors.issueDate}
              />
              {errors.issueDate && (
                <Typography variant="small" color="red" className="mt-1">
                  يرجى تحديد تاريخ الإصدار
                </Typography>
              )}
            </div>
            <div>
              <Input
                disabled={getValues("paymentStatus") !== "PAID"}
                {...register("paymentDate")}
                type="date"
                label="تاريخ الدفع"
                size="lg"
              />
            </div>
          </motion.div>
        </div>

        {/* Additional Notes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <Textarea
            {...register("notes")}
            label="ملاحظات إضافية"
            size="lg"
            className="min-h-[120px]"
          />
        </motion.div>

        {/* Form Actions */}
        <motion.div
          className="flex justify-between pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
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
        </motion.div>
      </form>
    </motion.div>
  );
}