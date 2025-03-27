import { Button, IconButton } from "@material-tailwind/react";
import React, { useState } from "react";
import { AiOutlineStock } from "react-icons/ai";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useForm } from "react-hook-form";
import { Input, Typography, Select, Option } from "@material-tailwind/react";
import { useCredentials } from "@/context/CredentialsContext";
import { addStockHistory } from "@/services/storeService"; // Assuming you have a service for stock history
import ReactDOM from "react-dom";
import { IoAddCircle } from "react-icons/io5";

const MySwal = withReactContent(Swal);
{
  /* قائمة أنواع العمليات */
}

export default function AddStock(props) {
  const { userToken } = useCredentials();

  const fireSwal = () => {
    MySwal.fire({
      title: "إضافة كمية جديدة للمنتج",
      html: '<div id="add-stock-form" className="w-full"></div>',
      showConfirmButton: false,
      customClass: {
        popup: "overflow-y-scroll overflow-x-hidden",
      },
      didOpen: () => {
        ReactDOM.render(
          <StockForm
            productId={props.productId}
            currentStock={props.currentStock}
            userToken={userToken}
            onClose={() => MySwal.close()}
            fetchProducts={props.fetchProducts}
          />,
          document.getElementById("add-stock-form")
        );
      },
    });
  };

  return (
    <IconButton {...props} onClick={fireSwal}>
      <IoAddCircle size={20} />
    </IconButton>
  );
}

const stockOperations = [
  { value: "sale", label: "🛒 بيع منتج" },
  { value: "restock", label: "📦 إعادة تخزين" },
  { value: "reset", label: "🔄 تصفير المخزون" },
  { value: "adjustment", label: "⚙️ تعديل يدوي" },
  { value: "return", label: "♻️ إرجاع منتج" },
  { value: "cancel_sale", label: "❌ إلغاء عملية بيع" },
  { value: "cancel_restock", label: "❌ إلغاء عملية شراء" },
  { value: "reserve", label: "⏳ حجز مخزون" },
  { value: "release_reserve", label: "🔓 إلغاء حجز مخزون" },
  { value: "damage", label: "🏷️ خصم تالف" },
  { value: "inventory_check", label: "🔍 جرد المخزون" },
];
const StockForm = ({
  productId,
  currentStock,
  userToken,
  onClose,
  fetchProducts,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { newStock, changeType } = data;

      // Prepare the payload for the stock history
      const payload = {
        productId,
        oldStock: currentStock,
        quantityToAdd: parseInt(newStock),
        changeType: String(changeType).toUpperCase(),
      };

      // Call the API to add stock history
      await addStockHistory(payload, userToken);

      // Show success message
      await MySwal.fire("", "تمت تعديل الكمية بنجاح!", "success");

      // Reset the form and close the modal
      reset();
      onClose();

      // Refresh the products list
      fetchProducts();
    } catch (error) {
      console.log(error.message);

      await MySwal.fire(
        "",
        "حدث خطأ أثناء إضافة الكمية." + error.message,
        "error"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
      {/* Current Stock Display */}
      <div className="space-y-4">
        <Typography variant="h5">الكمية الحالية</Typography>
        <Input label="الكمية الحالية" value={currentStock} disabled />
      </div>

      {/* New Stock Quantity */}
      <div className="space-y-4">
        <Typography variant="h5">الكمية الجديدة</Typography>
        <Input
          label="الكمية الجديدة"
          type="number"
          {...register("newStock", {
            required: "يجب إدخال الكمية الجديدة",
            min: {
              value: 0,
              message: "يجب أن تكون الكمية أكبر من أو تساوي الصفر",
            },
          })}
          error={!!errors.newStock}
        />
        {errors.newStock && (
          <Typography variant="small" color="red">
            {errors.newStock.message}
          </Typography>
        )}
      </div>

      {/* نوع التغيير */}
      <div className="space-y-4">
        <Typography variant="h5">نوع التغيير</Typography>
        <select
          {...register("changeType", {
            required: "يرجى تحديد نوع العملية",
          })}
          className="w-full border border-borderColor rounded-md shadow-sm p-2 text-sm"
        >
          {stockOperations.map((operation) => (
            <option key={operation.value} value={operation.value}>
              {operation.label}
            </option>
          ))}
        </select>

        {errors.changeType && (
          <Typography variant="small" color="red">
            {errors.changeType.message}
          </Typography>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" fullWidth color="blue">
        تأكيد إضافة الكمية
      </Button>
    </form>
  );
};
