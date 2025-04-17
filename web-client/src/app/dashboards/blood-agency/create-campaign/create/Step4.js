import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Input } from "@material-tailwind/react";

const Step4 = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6 grid grid-cols-[500px] mx-auto" dir="rtl">
      <h1 className="text-xl font-bold">تفاصيل الاتصال والتواصل (اختيارية)</h1>

      <motion.div
        key="facebook"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Input
          {...register("socialLinks.facebook")}
          variant="outlined"
          color="teal"
          placeholder="رابط صفحة فيسبوك"
          label="رابط فيسبوك"
        />
      </motion.div>

      <motion.div
        key="instagram"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Input
          {...register("socialLinks.instagram")}
          variant="outlined"
          color="teal"
          placeholder="رابط حساب إنستغرام"
          label="رابط إنستغرام"
        />
      </motion.div>

      <motion.div
        key="twitter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Input
          {...register("socialLinks.twitter")}
          variant="outlined"
          color="teal"
          placeholder="رابط حساب تويتر"
          label="رابط تويتر"
        />
      </motion.div>
    </div>
  );
};

export default Step4;
