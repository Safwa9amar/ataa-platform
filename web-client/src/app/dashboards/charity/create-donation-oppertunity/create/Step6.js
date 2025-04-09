import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { FileUploader } from "react-drag-drop-files";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "@material-tailwind/react";
import useFileUpload from "@/hooks/useFileUpload";
import FileDisplay from "@/components/UI/FileDisplay";

export default function Step6() {
  const {
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext();
  const { uploadFile, uploadedFile, uploadProgress, loading, setShowToast } =
    useFileUpload();
  const proofFiles = watch("proofFiles") || [];

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
        وثائق التحقق
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

      <div className="max-w-2xl mx-auto m-5 p-4 bg-mangoBlack rounded-lg shadow-md">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          خطة عمل أو دراسة جدوى : إذا كان المشروع المرد تنفيذه يصنف من المشاريع
          الكبرى يرجى إرفاق ملف pdf حول كيفية تنفيذ المشروع، المراحل الزمنية،
          الموارد المطلوبة، تقارير ميدانية توضح الحاجة أو المشاكل التي سيتم
          معالجتها من خلال المشروع، والمخاطر المحتملة...إلخ
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          إثبات ملكية أو تصريح استخدام الأرض أو المبنى : إذا كانت الفرصة تتعلق
          بمشروع بناء أو تطوير مثل المنازل أو المساجد. ، فإن إثبات ملكية الأرض
          أو تصريح استخدامها ضروري لضمان قانونية المشروع.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          التراخيص الطبية: إذا كانت الفرصة تتعلق بتقديم خدمات طبية (عمليات
          جراحية، تصفية دم، العلاج بالكيماوي...إلخ) يرجى إرفاق أي تراخيص متوفرة
          للأطباء أو المستشفيات المشاركة في المشروع.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          - وصفات الدواء: إذا كانت الفرصة تتعلق بشراء أدوية يرجى إرفاق الوصفة
          الطبية
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          * فرص تيسرت : - إثبات الديون: يرجى إرفاق وثائق تثبت وجود الديون
          المستحقة على المستفيدين لضمان الشفافية
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          * فرص فرجت :- إثبات الحكم القضائي : يرجى إرفاق الوثيقة التي تأكد الحكم
          القضائي و توضح سببه
        </motion.p>
      </div>

    </motion.div>
  );
}
