import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import Image from "next/image";
import { FileUploader } from "react-drag-drop-files";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "@material-tailwind/react";
import useImageUpload from "@/hooks/useImageUpload";
import API_ENDPOINTS from "@/config/apiEndPoints";

export default function Step4() {
  const {
    formState: { errors },
    setValue,
    watch,
    control,
  } = useFormContext();
  const {
    isUploading,
    uploadedFile,
    uploadProgress,
    uploadImage,
    deleteImageFromServer,
    setShowToast,
  } = useImageUpload();
  const images = watch("images");

  const handlePickImages = async (files) => {
    if (!files || files.length === 0) return;
    await uploadImage(files);
  };

  const removeImage = async (index) => {
    const imageToDelete = images[index];

    if (imageToDelete.serverUrl) {
      try {
        await deleteImageFromServer(imageToDelete.serverUrl);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }

    setValue(
      "images",
      images.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    uploadedFile && setValue("images", [...images, uploadedFile]);
  }, [uploadedFile]);
  useEffect(() => {
    setShowToast(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 m-10"
    >
      <Typography className="text-center" variant="lead">
        صور الحملة
      </Typography>

      <div className="flex flex-col items-center gap-4">
        <Controller
          control={control}
          name="images"
          rules={{
            validate: (value) =>
              value?.length >= 1 || "يجب تحميل صور الحملة.",
          }}
          render={({ field }) => (
            <FileUploader
              {...field}
              handleChange={handlePickImages}
              name="file"
              multiple
              types={["JPG", "PNG", "JPEG"]}
              label="قم باختيار أو إسقاط صورة"
              uploadedLabel="تم رفع الصورة بنجاح، يمكنك رفع المزيد"
              hoverTitle="قم بإسقاط الصورة هنا"
            />
          )}
        />
        {errors.images && (
          <p className="text-red-500 text-sm">{errors.images.message}</p>
        )}

        {/* شريط التحميل مع حركة سلسة */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${uploadProgress}%` }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
            >
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${uploadProgress}%` }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* عرض الصور المحملة مع تأثيرات */}
        <div className="flex flex-wrap gap-4">
          <AnimatePresence>
            {images.length > 0 &&
              images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="rounded-md overflow-hidden"
                  >
                    <Image
                      width={200}
                      height={200}
                      alt={`Uploaded image ${index + 1}`}
                      src={API_ENDPOINTS.UPLOADS + "/" + image.filename}
                      className="rounded-md"
                    />
                  </motion.div>
                  <button
                    className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1"
                    onClick={() => removeImage(index)}
                  >
                    <XCircleIcon className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
