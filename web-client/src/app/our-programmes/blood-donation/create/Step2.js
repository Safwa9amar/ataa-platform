import { useAlgeriaCitiesContext } from "@/context/AlgeriaCitiesContext";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Typography } from "@material-tailwind/react";

export default function Step2() {
  const { wilayas, dairas, communes, fetchDairas, fetchCommunes } =
    useAlgeriaCitiesContext();
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const selectedWilaya = watch("wilaya");
  const selectedDaira = watch("daira");

  useEffect(() => {
    if (selectedWilaya) {
      fetchDairas(selectedWilaya);
    }
  }, [selectedWilaya]);

  useEffect(() => {
    if (selectedDaira) {
      fetchCommunes(selectedWilaya, selectedDaira);
    }
  }, [selectedDaira]);

  return (
    <motion.div
      className="space-y-4 grid grid-cols-[550px]"
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Typography className="text-center" variant="lead">
        المنطقة والعنوان
      </Typography>
      {/* Wilaya Dropdown */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label>الولاية</label>
        <motion.select
          {...register("wilaya", { required: "يرجى تحديد الولاية" })}
          className="w-full border border-borderColor p-2 rounded-md"
          whileHover={{ scale: 1.02 }}
        >
          <option value="">اختر الولاية</option>
          {wilayas.map((wilaya) => (
            <option key={wilaya.wilaya_code} value={wilaya.wilaya_code}>
              {wilaya.wilaya_name}
            </option>
          ))}
        </motion.select>
        {errors.wilaya && (
          <p className="text-red-500 text-sm">{errors.wilaya.message}</p>
        )}
      </motion.div>

      {/* Daira Dropdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: selectedWilaya ? 1 : 0.5,
          y: selectedWilaya ? 0 : 10,
        }}
        transition={{ delay: 0.3 }}
      >
        <label>الدائرة</label>
        <motion.select
          {...register("daira", { required: "يرجى تحديد الدائرة" })}
          className="w-full border border-borderColor p-2 rounded-md"
          disabled={!selectedWilaya}
          whileHover={{ scale: 1.02 }}
        >
          <option value="">اختر الدائرة</option>
          {dairas.map((daira) => (
            <option key={daira.daira_name_ascii} value={daira.daira_name_ascii}>
              {daira.daira_name}
            </option>
          ))}
        </motion.select>
        {errors.daira && (
          <p className="text-red-500 text-sm">{errors.daira.message}</p>
        )}
      </motion.div>

      {/* Commune Dropdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: selectedDaira ? 1 : 0.5,
          y: selectedDaira ? 0 : 10,
        }}
        transition={{ delay: 0.4 }}
      >
        <label>البلدية</label>
        <motion.select
          {...register("commune", {
            required: "يرجى تحديد البلدية",
            valueAsNumber: true,
          })}
          className="w-full border border-borderColor p-2 rounded-md"
          disabled={!selectedDaira}
          whileHover={{ scale: 1.02 }}
        >
          <option value="">اختر البلدية</option>
          {communes.map((commune) => (
            <option key={commune.id} value={commune.id}>
              {commune.commune_name}
            </option>
          ))}
        </motion.select>
        {errors.commune && (
          <p className="text-red-500 text-sm">{errors.commune.message}</p>
        )}
      </motion.div>
    </motion.div>
  );
}
