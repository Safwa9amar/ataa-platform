import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { FileUploader } from "react-drag-drop-files";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "@material-tailwind/react";
import useFileUpload from "@/hooks/useFileUpload";
import FileDisplay from "@/components/UI/FileDisplay";

export default function Step5() {
  const {
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext();
  const { uploadFile, uploadedFile, uploadProgress, loading, setShowToast } =
    useFileUpload();
  const proofFiles = watch("proofFiles");

  const handlePickFile = async (files) => {
    if (!files || files.length === 0) {
      Swal.fire({
        icon: "error",
        title: "لم يتم اختيار أي ملف",
        text: "يرجى اختيار ملف للرفع.",
      });
      return;
    }

    try {
      await uploadFile(files);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "خطأ أثناء رفع الملف",
        text:
          error?.message ||
          "حدث خطأ أثناء رفع الملفات، يرجى المحاولة مرة أخرى.",
      });
    }
  };

  const removeFile = (index) => {
    setValue(
      "proofFiles",
      proofFiles.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    uploadedFile && setValue("proofFiles", [...proofFiles, uploadedFile]);
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
      className="m-10"
    >
      <Typography className="text-center" variant="lead">
        وثائق اثبات الحملة
      </Typography>

      <div className="flex flex-col items-center gap-4">
        <Controller
          control={control}
          name="proofFiles"
          rules={{
            required: "ملفات التحقق مطلوبة",
          }}
          render={({ field }) => (
            <FileUploader
              {...field}
              handleChange={handlePickFile}
              name="file"
              multiple
              types={["DOC", "PDF", "DOCX"]}
              label="قم باختيار أو إسقاط ملف"
              uploadedLabel="تم رفع الملف بنجاح، يمكنك رفع المزيد"
              hoverTitle="قم بإسقاط الملف هنا"
            />
          )}
        />
        {errors.proofFiles && (
          <p className="text-red-500 text-sm">{errors.proofFiles.message}</p>
        )}

        {/* شريط التحميل مع حركة سلسة */}
        <AnimatePresence>
          {loading && (
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

        {/* عرض الملفات المحملة مع تأثيرات */}
        <div className="flex flex-wrap gap-4">
          <AnimatePresence>
            {proofFiles.length > 0 &&
              proofFiles.map((file, index) => (
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
                    <FileDisplay
                      filename={file?.filename}
                      mimetype={file?.mimetype}
                    />
                  </motion.div>
                  <button
                    className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1"
                    onClick={() => removeFile(index)}
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
