import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Input, Textarea } from "@material-tailwind/react";

const Step4 = () => {
  const {
    register,
    watch,
    getValues,
    formState: { errors },
    setValue,
  } = useFormContext();

  return (
    <div className="space-y-6 grid grid-cols-[500px] mx-auto" dir="rtl">
      <motion.div
        key="numOfBeneficiaries"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <p>
          عدد المستفيدين : حدد عدد المستفيدين من الفرصة في حالة عدم توفر
          المعلومة يمكن تحديد عدد مستفيدين محتمل شرط أن يتوافق مع المبلغ
          المالي المستهدف جمعه
        </p>

        <Input
          {...register("numOfBeneficiaries", {
            required: "عدد المستفيدين مطلوب",
            valueAsNumber: true,
          })}
          type="number"
          variant="standard"
          color={errors.numOfBeneficiaries ? "red" : "teal"}
          placeholder="أدخل عدد المستفيدين"
          label="عدد المستفيدين"
        />
        {errors.numOfBeneficiaries && (
          <p className="text-red-500 text-sm">
            {errors.numOfBeneficiaries.message}
          </p>
        )}

        <p>
          قدم وصفًا للموارد التي ستستخدمها الجمعية والاحتياجات الخاصة لتحقيق
          أهداف الفرصة (معلومة لن تعرض على المنصة)
        </p>

        <Textarea
          {...register("needs", {
            required: "الاحتياجات مطلوبة",
          })}
          resize
          variant="static"
          color={errors.needs ? "red" : "teal"}
          placeholder="أدخل الاحتياجات"
          label="الاحتياجات"
        />
        {errors.needs && (
          <p className="text-red-500 text-sm">{errors.needs.message}</p>
        )}
      </motion.div>
    </div>
  );
};

export default Step4;
