"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Input,
  Textarea,
  Select,
  Option,
  Button,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckIcon,
  CurrencyDollarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { getIncomeById, updateIncome } from "@/services/IncomeCharityServices";
import { useCredentials } from "@/context/CredentialsContext";
import Swal from "sweetalert2";

export default function EditIncomeForm({ params }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { userToken } = useCredentials();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const incomeId = params.incomeId

  // Fetch income data when the component mounts
  useEffect(() => {
    
    const fetchIncomeData = async () => {
      try {
        const incomeData = await getIncomeById(incomeId, userToken);
        // Set form values with fetched data
        setValue("source", incomeData.source);
        setValue("amount", incomeData.amount);
        setValue("receiptDate", new Date(incomeData.receiptDate).toISOString().split("T")[0]);
        setValue("notes", incomeData.notes);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "حدث خطأ أثناء جلب البيانات",
          text: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (incomeId) {
      fetchIncomeData();
    }
  }, [incomeId, userToken, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await updateIncome(incomeId, data, userToken);
      Swal.fire({
        icon: "success",
        title: "تم تحديث البيانات بنجاح",
      });
      router.push("/dashboards/charity/Expenses/incomes-table"); // Redirect to incomes table
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ أثناء التحديث",
        text: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="bg-transparent p-10 shadow-lg rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-5">
          {/* Income Source */}
          <div className="relative flex flex-col">
            <label htmlFor="source">مصدر الايرادات</label>
            <CurrencyDollarIcon className="h-5 w-5 absolute right-3 top-9 " />
            <select
              className="border border-borderColor pr-10 pl-5  py-2 rounded-md focus:outline-none focus:border-blue-500"
              {...register("source", { required: true })}
              label="مصدر الإيرادات"
              size="lg"
              error={!!errors.source}
            >
              <option value="DONATION">تبرعات</option>
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
          </div>

          {/* Income Amount */}
          <div>
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
          </div>

          {/* Income Date */}
          <div>
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
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <Textarea
            {...register("notes")}
            label="ملاحظات إضافية"
            size="lg"
            className="min-h-[120px]"
          />
        </div>

        {/* Form Actions */}
        <CardFooter className="flex justify-between p-0 pt-6">
          <Button
            variant="text"
            className="flex items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            رجوع
          </Button>

          <Button
            type="submit"
            color="green"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Spinner className="h-4 w-4" />
                جاري التحديث...
              </>
            ) : (
              <>
                <CheckIcon className="h-5 w-5" />
                حفظ التغييرات
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}