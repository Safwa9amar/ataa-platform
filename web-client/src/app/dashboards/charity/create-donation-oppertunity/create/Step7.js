import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Textarea } from "@material-tailwind/react";
import FileDisplay from "@/components/UI/FileDisplay";
import { FileUploader } from "react-drag-drop-files";

const Step7 = () => {
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useFormContext();

  return (
    <div className="space-y-4 grid grid-cols-[500px] mx-auto" dir="rtl">
      {/* Partner's Full Name */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <label className="block text-sm font-medium text-gray-700">
          الإسم الكامل للجهة الشريكة
        </label>
        <Textarea
          {...register("partner_name")}
          resize
          variant="static"
          color={errors.partner_name ? "red" : "teal"}
          placeholder="أدخل الشركاء"
        />
        {errors.partner_name && (
          <p className="text-red-500 text-sm">{errors.partner_name.message}</p>
        )}
      </motion.div>

      {/* Partner's Role */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <label className="block text-sm font-medium text-gray-700">
          دور الشريك في تنفيذ الفرصة
        </label>
        <Textarea
          {...register("partner_role")}
          resize
          variant="static"
          color={errors.partner_role ? "red" : "teal"}
          placeholder="أدخل دور الشريك"
        />
        {errors.partner_role && (
          <p className="text-red-500 text-sm">{errors.partner_role.message}</p>
        )}
      </motion.div>

      {/* Partnership Contract */}
      {getValues("partnershipContract") ? (
        <FileDisplay
          filename={getValues("partnershipContract")?.filename}
          mimetype={getValues("partnershipContract")?.mimetype}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700">
            الرجاء إرفاق نسخة من عقد الشراكة
          </label>
          <FileUploader
            {...register("partnershipContract")}
            color={errors.partnershipContract ? "red" : "teal"}
            handleChange={async (files) => {
              let resFile = await uploadImage(files);
              setValue("partnershipContract", resFile);
            }}
            multiple
            types={["PDF"]}
            uploadedLabel="تم رفع الملف بنجاح"
            hoverTitle="الرجاء إرفاق نسخة من عقد الشراكة"
          />
          {errors.partnershipContract && (
            <p className="text-red-500 text-sm">
              {errors.partnershipContract.message}
            </p>
          )}
        </motion.div>
      )}

      {/* Official Approval Letter */}
      {getValues("approvalLetter") ? (
        <FileDisplay
          filename={getValues("approvalLetter")?.filename}
          mimetype={getValues("approvalLetter")?.mimetype}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <label className="block text-sm font-medium text-gray-700">
            الرجاء إرفاق نسخة من خطاب اعتماد أو موافقة رسمية
          </label>
          <FileUploader
            {...register("approvalLetter")}
            color={errors.approvalLetter ? "red" : "teal"}
            handleChange={async (files) => {
              let resFile = await uploadImage(files);
              setValue("approvalLetter", resFile);
            }}
            multiple
            types={["PDF"]}
            uploadedLabel="تم رفع الملف بنجاح"
            hoverTitle="الرجاء إرفاق نسخة من خطاب اعتماد أو موافقة رسمية"
          />
          {errors.approvalLetter && (
            <p className="text-red-500 text-sm">
              {errors.approvalLetter.message}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Step7;
