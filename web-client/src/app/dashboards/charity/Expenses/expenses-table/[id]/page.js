"use client";

import { useState, useEffect } from "react";
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
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useCredentials } from "@/context/CredentialsContext";
import Swal from "sweetalert2";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import {
  getExpenseById,
  updateExpense,
} from "@/services/ExpenseCharityServices";

export default function EditIncomeForm({ params }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { userToken } = useCredentials();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const expenseId = params.id;

  // Fetch income data when the component mounts
  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const data = await getExpenseById(expenseId, userToken);
        // Set form values with fetched data
        setValue("source", data.source);
        setValue("amount", data.amount);
        setValue("beneficiary", data.recipient);
        setValue(
          "paymentDate",
          new Date(data.paymentDate).toISOString().split("T")[0]
        );
        setValue("notes", data.notes);
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

    if (expenseId) {
      fetchExpenseData();
    }
  }, [expenseId, userToken, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await updateExpense(expenseId, data, userToken);
      Swal.fire({
        icon: "success",
        title: "تم تحديث البيانات بنجاح",
      });
      router.push("/dashboards/charity/Expenses/expenses-table"); // Redirect to incomes table
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
          {/* Expense Type */}
          <div className="relative flex flex-col">
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
              {...register("paymentDate", { required: true })}
              type="date"
              label="تاريخ الاستلام"
              size="lg"
              error={!!errors.paymentDate}
            />
            {errors.paymentDate && (
              <Typography variant="small" color="red" className="mt-1">
                يرجى تحديد تاريخ صحيح
              </Typography>
            )}
          </div>
        </div>
        {/* Beneficiary */}
        <div>
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
