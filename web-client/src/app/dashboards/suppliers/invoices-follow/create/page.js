"use client";
import { Avatar, Button } from "@material-tailwind/react";
import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useForm } from "react-hook-form";
import {
  Input,
  Typography,
  Select,
  Option,
  Textarea,
  IconButton,
  Card,
} from "@material-tailwind/react";
import { useStore } from "@/context/StoreContext";
import { IoClose } from "react-icons/io5";
import { useCredentials } from "@/context/CredentialsContext";

import { DocumentIcon } from "@heroicons/react/24/solid";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import withRoleProtection from "@/components/hoc/withRoleProtection";
import useProductSearch from "@/hooks/useProductSearch";
import { getMyProducts } from "@/services/storeService";
import axios from "axios";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import Link from "next/link";
import SelectCharity from "./SelectCharity";

const TABLE_HEAD = [
  "",
  "المنتج",
  "الكمية",
  "سعر الوحدة",
  "السعر الكلي",
  "Actions",
];

const MySwal = withReactContent(Swal);

function AddInvoiceForm({}) {
  const { userToken, user } = useCredentials();
  const { data: products, handleSearch } = useProductSearch(getMyProducts, 100);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm();

  const [selectedProducts, setSelectedProducts] = useState([]);

  const onSubmit = async (data) => {
    try {
      const invoiceData = {
        ...data,
        invoiceProducts: selectedProducts.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
          priceAtInvoice: product.price,
        })),
      };
      await axios.post(
        API_ENDPOINTS.DASHBOARDS.SUPPLIERS + "invoices-follow",
        invoiceData,
        {
          headers: getCommonHeaders(userToken),
        }
      );

      await MySwal.fire("", "تم إنشاء الفاتورة بنجاح!", "success");
      reset();
    } catch (error) {
      await MySwal.fire("", "حدث خطأ أثناء إنشاء الفاتورة.", "error");
    }
  };

  const addProduct = (productId) => {
    if (!productId) return;
    const product = products.find((p) => p.id === productId);
    const selectedProduct = selectedProducts.find((p) => p.id === productId);
    if (!selectedProduct) {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const removeProduct = (productId) => {
    setSelectedProducts(
      selectedProducts.filter((product) => product.id !== productId)
    );
  };

  const updateProductQuantity = (productId, quantity) => {
    setSelectedProducts(
      selectedProducts.map((product) =>
        product.id === productId ? { ...product, quantity } : product
      )
    );
  };

  return (
    <div className="container p-10 flex flex-col gap-4" dir="rtl">
      <div className="text-right space-y-4" dir="ltr">
        <Typography variant="h3">نموذج متابعة الفواتير</Typography>
        <Typography variant="h6" className="text-textColor">
          {user?.partners.fullName}
        </Typography>

        <Typography variant="h6" className="text-textColor">
          {user?.partners.mainAddress}
        </Typography>

        <Typography variant="h6" className="text-textColor">
          {user?.partners.phone}
        </Typography>
        <Typography variant="h6" className="text-textColor">
          {user?.partners.email}
        </Typography>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl my-10"
        dir="rtl"
      >
        {/* Invoice Information */}
        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-5">
            {/* Invoice Number */}
            <Input
              color="teal"
              variant="static"
              label="الرقم التعريفي لفرصة التبرع"
              {...register("donationOpportunityId", {
                required: "يجب إدخال الرقم التعريفي لفرصة التبرع",
              })}
              error={!!errors.donationOpportunityId}
            />
            {errors.donationOpportunityId && (
              <Typography variant="small" color="red">
                {errors.donationOpportunityId.message}
              </Typography>
            )}
            {/* Issued By */}
            <Input
              color="teal"
              variant="static"
              label="الجهة المصدرة"
              {...register("issuedBySupplier", {
                required: "يجب إدخال اسم المصدر",
              })}
              error={!!errors.issuedBySupplier}
            />
            {errors.issuedBySupplier && (
              <Typography variant="small" color="red">
                {errors.issuedBySupplier.message}
              </Typography>
            )}

            <SelectCharity
              label="الجهة المستفيدة"
              {...register("charityId", {
                required: "يجب تحديد الجهة المستفيدة",
              })}
              error={!!errors.charityId}
              onChange={(e) => setValue("charityId", e.target.value)}
            />

            {/* Issued To */}
            {errors.charityId && (
              <Typography variant="small" color="red">
                {errors.charityId.message}
              </Typography>
            )}
            {errors.paymentDate && (
              <Typography variant="small" color="red">
                {errors.paymentDate.message}
              </Typography>
            )}
          </div>
          <div className="space-y-5">
            {/* Issue Date */}
            <Input
              color="teal"
              variant="static"
              label="تاريخ الإصدار"
              type="date"
              {...register("issueDate", {
                required: "يجب إدخال تاريخ الإصدار",
              })}
              error={!!errors.issueDate}
            />
            {errors.issueDate && (
              <Typography variant="small" color="red">
                {errors.issueDate.message}
              </Typography>
            )}

            {/* Payment Date */}
            <Input
              color="teal"
              variant="static"
              label="تاريخ الدفع"
              type="date"
              {...register("paymentDate")}
              error={!!errors.paymentDate}
            />
          </div>
        </div>

        {/* Invoice Products */}
        <div className="space-y-4 w-72 my-5">
          {/* Product Selection */}
          {/* <Input color="teal" label="ابحث عن منتج" list="products" /> */}
          <select
            onChange={(e) => addProduct(e.target.value)}
            className="py-2  bg-transparent w-full border-b border-blue-gray-300 shadow-sm hover:shadow-md font-ElMessiri text-sm"
          >
            <option value="">الرجاء اختيار منتج</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <Card className="h-full w-full overflow-scroll">
          <table className="w-full  table-auto text-right">
            <thead className="bg-teal-300 text-white">
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="p-4 pt-10">
                    <Typography
                      variant="small"
                      className="font-bold leading-none"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Selected Products List */}
              {selectedProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-10">
                    <Avatar
                      src={
                        API_ENDPOINTS.UPLOADS +
                        "/" +
                        product.productImages[0].filename
                      }
                    />
                  </td>
                  <td className="p-4">
                    <Typography>{product.name}</Typography>
                  </td>
                  <td className="p-4">
                    <Input
                      color="teal"
                      variant="static"
                      type="number"
                      min={0}
                      value={product.quantity}
                      onChange={(e) =>
                        updateProductQuantity(
                          product.id,
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td>{product.price} دج</td>
                  <td>{product.price * product.quantity} دج</td>
                  <td>
                    <IconButton
                      variant="outlined"
                      size="sm"
                      color="red"
                      onClick={() => removeProduct(product.id)}
                    >
                      <IoClose size={20} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        {/* Notes */}
        <br />
        <Textarea
          className="my-5"
          label="ملاحظات"
          {...register("notes")}
          error={!!errors.notes}
        />
        {errors.notes && (
          <Typography variant="small" color="red">
            {errors.notes.message}
          </Typography>
        )}
        <div className="flex items-center gap-5">
          {/* Submit Button */}
          <Button
            type="submit"
            color="teal"
            className="my-5 self-start rounded-full"
          >
            تأكيد إنشاء الفاتورة
          </Button>
          <Link
            className="text-sm h-fit border border-teal-700 text-teal-700 hover:text-white text-center p-2 hover:bg-teal-700 transition-all w-52 rounded-full "
            href={"/dashboards/suppliers/invoices-follow/"}
          >
            متابعة الفواتير
          </Link>
        </div>
      </form>
    </div>
  );
}

export default withRoleProtection(AddInvoiceForm, ["partner"]);
