"use client";
import React, { useState } from "react";
import { AiOutlineProduct } from "react-icons/ai";
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
  Button,
  Tooltip,
} from "@material-tailwind/react";
import { useStore } from "@/context/StoreContext";
import useImageUpload from "@/hooks/useImageUpload";
import { FileUploader } from "react-drag-drop-files";
import { IoClose } from "react-icons/io5";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { addProduct } from "@/services/storeService";
import { useCredentials } from "@/context/CredentialsContext";
import ReactDOM from "react-dom";
import { BiInfoCircle } from "react-icons/bi";

const MySwal = withReactContent(Swal);

export default function AddProductForm({ fetchProducts }) {
  const { categories: productCategories } = useStore();
  const { uploadImage } = useImageUpload();
  const { userToken } = useCredentials();

  const fireSwal = () => {
    MySwal.fire({
      title: "إضافة منتج جديد",
      html: '<div id="add-product-form" className="w-full"></div>',
      showConfirmButton: false,
      customClass: {
        popup: "h-[90vh] overflow-y-scroll overflow-x-hidden",
      },
      didOpen: () => {
        ReactDOM.render(
          <ProductForm
            productCategories={productCategories}
            uploadImage={uploadImage}
            userToken={userToken}
            onClose={() => MySwal.close()}
            fetchProducts={fetchProducts}
          />,
          document.getElementById("add-product-form")
        );
      },
    });
  };

  return (
    <Button
      className="w-52 flex items-center justify-center gap-2 rounded-full"
      size="sm"
      variant="outlined"
      color="green"
      onClick={fireSwal}
    >
      <p>اضافة منتج</p>
      <AiOutlineProduct size={20} />
    </Button>
  );
}

const ProductForm = ({
  productCategories,
  uploadImage,
  userToken,
  onClose,
  fetchProducts,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await addProduct(data, userToken);
      await MySwal.fire("", "تمت إضافة المنتج بنجاح!", "success");
      reset();
      onClose(); // إغلاق النافذة بعد الإرسال الناجح
      fetchProducts();
    } catch (error) {
      await MySwal.fire("", "حدث خطأ أثناء إضافة المنتج.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
      {/* General Product Information */}
      <div className="space-y-4">
        <Typography variant="h5">معلومات عامة عن المنتج</Typography>

        {/* Product Name */}
        <Input
          label="اسم المنتج"
          {...register("name", { required: "يجب إدخال اسم المنتج" })}
          error={!!errors.name}
        />
        {errors.name && (
          <Typography variant="small" color="red">
            {errors.name.message}
          </Typography>
        )}

        {/* Product Category */}
        <Select
          label="فئة المنتج"
          {...register("category", { required: "يجب اختيار فئة المنتج" })}
          error={!!errors.category}
          onChange={(value) => setValue("category", value)}
        >
          {productCategories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
        {errors.category && (
          <Typography variant="small" color="red">
            {errors.category.message}
          </Typography>
        )}

        {/* Product Description */}
        <Textarea
          label="وصف المنتج"
          {...register("description", { required: "يجب إدخال وصف المنتج" })}
          error={!!errors.description}
        />
        {errors.description && (
          <Typography variant="small" color="red">
            {errors.description.message}
          </Typography>
        )}
      </div>

      {/* Price and Stock Details */}
      <div className="space-y-4">
        <Typography variant="h5">تفاصيل السعر والمخزون</Typography>

        {/* Product Price */}
        <Input
          label="سعر المنتج (شامل تكاليف التوصيل)"
          type="number"
          {...register("price", { required: "يجب إدخال سعر المنتج" })}
          error={!!errors.price}
        />
        {errors.price && (
          <Typography variant="small" color="red">
            {errors.price.message}
          </Typography>
        )}

        {/* Available Quantity */}
        <Input
          label="الكمية المتاحة"
          type="number"
          {...register("quantity", { required: "يجب إدخال الكمية المتاحة" })}
          error={!!errors.quantity}
        />
        {errors.quantity && (
          <Typography variant="small" color="red">
            {errors.quantity.message}
          </Typography>
        )}
      </div>

      {/* Quality Certificates */}
      <div className="space-y-4">
        <div className="flex justify-center items-start gap-2">
          <Typography variant="h5">التوثيق</Typography>
          <Tooltip
            className="z-[10000000]"
            content="يرجى إرفاق شهادات جودة للمنتج، خاصةً للمنتجات التقنية أو الطبية أو المنتجات التي لها تأثير على الصحة الجسمية"
          >
            <button>
              <BiInfoCircle />
            </button>
          </Tooltip>
        </div>
        <FileUploader
          handleChange={async (files) => {
            let resFile = await uploadImage(files);
            setValue(
              "qualityCertificates",
              getValues("qualityCertificates")
                ? [...getValues("qualityCertificates"), resFile]
                : [resFile]
            );
          }}
          multiple
          {...register("qualityCertificates")}
          types={["JPG", "PNG", "JPEG"]}
          label="قم باختيار أو اسقاط صورة"
          uploadedLabel="تم رفم الصورة بنجاح يمكنك رفم المزيد"
          hoverTitle="قم باسقاط الصورة هنا"
        />

        {errors.qualityCertificates && (
          <Typography variant="small" color="red">
            {errors.qualityCertificates.message}
          </Typography>
        )}
      </div>

      {/* Additional Details */}
      <div className="space-y-4">
        <Typography variant="h5">صور المنتج</Typography>

        <FileUploader
          handleChange={async (files) => {
            let resFile = await uploadImage(files);
            setValue(
              "productImages",
              getValues("productImages")
                ? [...getValues("productImages"), resFile]
                : [resFile]
            );
          }}
          multiple
          {...register("productImages", {
            required: "يجب تحميل صور المنتج",
          })}
          types={["JPG", "PNG", "JPEG"]}
          label="قم باختيار أو اسقاط صورة"
          uploadedLabel="تم رفم الصورة بنجاح يمكنك رفم المزيد"
          hoverTitle="قم باسقاط الصورة هنا"
        />
        {errors.productImages && (
          <Typography variant="small" color="red">
            {errors.productImages.message}
          </Typography>
        )}
        {watch("productImages")?.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {getValues("productImages").map((image, index) => (
              <div key={index} className="relative">
                <IconButton
                  className="absolute"
                  variant="gradient"
                  size="sm"
                  color="red"
                  onClick={(e) => {
                    let newImages = getValues("productImages").filter(
                      (img, i) => i !== index
                    );
                    setValue("productImages", newImages);
                  }}
                >
                  <IoClose size={20} />
                </IconButton>
                <img
                  className="rounded-md w-40 h-40 object-cover"
                  alt={`Uploaded image ${index + 1}`}
                  src={`${API_ENDPOINTS.UPLOADS}/${image?.filename}`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Social Media Links */}
        <Input
          label="روابط التواصل الاجتماعي"
          {...register("socialMediaLinks")}
          error={!!errors.socialMediaLinks}
        />
        {errors.socialMediaLinks && (
          <Typography variant="small" color="red">
            {errors.socialMediaLinks.message}
          </Typography>
        )}

        {/* Additional Information */}
        <Textarea
          label="معلومات إضافية"
          {...register("additionalDetails")}
          error={!!errors.additionalDetails}
        />
        {errors.additionalDetails && (
          <Typography variant="small" color="red">
            {errors.additionalDetails.message}
          </Typography>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" fullWidth color="green">
        تأكيد إضافة المنتج
      </Button>
    </form>
  );
};
