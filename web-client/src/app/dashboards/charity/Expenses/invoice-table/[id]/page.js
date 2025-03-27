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
  DocumentTextIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import {
  getInvoiceById,
  updateInvoice,
} from "@/services/InvoiceCharityServices";
import { useCredentials } from "@/context/CredentialsContext";
import Swal from "sweetalert2";

export default function EditInvoiceForm({ params }) {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { userToken } = useCredentials();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const invoiceId = params.id;
  useEffect(() => {
    watch();
  }, []);

  // Fetch invoice data when the component mounts
  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const data = await getInvoiceById(invoiceId, userToken);
        // Set form values with fetched data
        setValue("invoiceNumber", data.invoiceNumber);
        setValue("paymentStatus", data.paymentStatus);
        setValue("issuerBeneficiary", data.issuerBeneficiary);
        setValue("invoiceAmount", data.invoiceAmount);
        setValue(
          "issueDate",
          new Date(data.issueDate).toISOString().split("T")[0]
        );
        setValue(
          "paymentDate",
          data.paymentDate
            ? new Date(data.paymentDate).toISOString().split("T")[0]
            : ""
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

    if (invoiceId) {
      fetchInvoiceData();
    }
  }, [invoiceId, userToken, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await updateInvoice(invoiceId, data, userToken);
      Swal.fire({
        icon: "success",
        title: "تم تحديث البيانات بنجاح",
      });
      router.push("/dashboards/charity/Expenses/invoice-table"); // Redirect to invoices table
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
          {/* Invoice Number */}
          <div>
            <Input
              {...register("invoiceNumber", { required: true })}
              type="text"
              label="رقم الفاتورة"
              size="lg"
              error={!!errors.invoiceNumber}
              icon={<DocumentTextIcon className="h-5 w-5" />}
            />
            {errors.invoiceNumber && (
              <Typography variant="small" color="red" className="mt-1">
                هذا الحقل مطلوب
              </Typography>
            )}
          </div>

          {/* Payment Status */}
          <div className="relative flex flex-col">
            <label htmlFor="paymentStatus">حالة الدفع</label>
            <select
              className="border border-borderColor pr-10 pl-5 py-2 rounded-md focus:outline-none focus:border-blue-500"
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
          </div>

          {/* Issuer/Beneficiary */}
          <div>
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
          </div>

          {/* Invoice Amount */}
          <div>
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
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
