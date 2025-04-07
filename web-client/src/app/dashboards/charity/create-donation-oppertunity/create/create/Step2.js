import { useAlgeriaCitiesContext } from "@/context/AlgeriaCitiesContext";
import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Input,
  Textarea,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
} from "@material-tailwind/react";
import MarkdownGuide from "@/components/UI/MarkDownGuid";

export default function Step2() {
  const {
    wilayas,
    dairas,
    communes,
    fetchDairas,
    fetchCommunes,
    loading: loadingCities,
  } = useAlgeriaCitiesContext();

  const {
    register,
    watch,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const [openGuide, setGuideOpen] = useState(false);

  const selectedWilaya = watch("wilaya");
  const selectedDaira = watch("daira");

  useEffect(() => {
    if (selectedWilaya) {
      fetchDairas(selectedWilaya);
    }
  }, [selectedWilaya]);

  useEffect(() => {
    if (selectedDaira && selectedWilaya) {
      fetchCommunes(selectedWilaya, selectedDaira);
    }
  }, [selectedDaira]);

  return (
    <motion.div
      className="space-y-6 grid grid-cols-[minmax(500px,780px)] mx-auto"
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Title Field */}
      <div>
        <Input
          {...register("title", {
            required: "عنوان الفرصة مطلوب",
            maxLength: {
              value: 50,
              message: "يجب أن لا يتجاوز العنوان 50 حرفًا",
            },
          })}
          variant="standard"
          label="عنوان الفرصة"
          placeholder="أدخل عنوانًا مختصرًا وجذابًا"
          color={errors.title ? "red" : "teal"}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Short Description */}
      <div>
        <Textarea
          {...register("description", {
            required: "يرجى إدخال وصف قصير.",
            minLength: {
              value: 10,
              message: "يجب أن يكون الوصف أطول قليلاً (10 أحرف على الأقل).",
            },
            maxLength: {
              value: 500,
              message: "يرجى تقليل عدد الأحرف ليكون أقل من 500.",
            },
          })}
          variant="static"
          resize
          cols={30}
          label="وصف قصير"
          placeholder="اشرح طبيعة الفرصة وتأثيرها بشكل موجز."
          color={errors.description ? "red" : "teal"}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Markdown Guide Button */}
      <Button
        onClick={() => setGuideOpen(true)}
        className="text-lg bg-teal-300 dark:bg-teal-800 font-ReemKufi w-full"
      >
        تدعم منصة عطاء خاصية Markdown لتنسيق النصوص، يمكنك الاطلاع على الدليل من
        هنا
      </Button>

      {/* Markdown Guide Dialog */}
      <Dialog
        open={openGuide}
        handler={setGuideOpen}
        className="h-[560px] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>تنسيق النصوص في منصة عطاء</DialogHeader>
        <DialogBody>
          <MarkdownGuide />
        </DialogBody>
      </Dialog>

      {/* Overview Field */}
      <div>
        <Textarea
          {...register("overview", {
            required: "يرجى كتابة وصف تفصيلي.",
            minLength: {
              value: 10,
              message: "يجب أن يحتوي الوصف على 10 أحرف على الأقل.",
            },
          })}
          variant="static"
          resize
          cols={50}
          label="الوصف التفصيلي"
          placeholder="اشرح بالتفصيل أهداف الفرصة والفئات المستفيدة منها."
          color={errors.overview ? "red" : "teal"}
        />
        {errors.overview && (
          <p className="text-red-500 text-sm mt-1">{errors.overview.message}</p>
        )}
      </div>
      {/* Location Section */}
      <Typography variant="lead" className="text-center pt-6">
        المنطقة والعنوان
      </Typography>
      {/* Wilaya Dropdown */}
      <div>
        <label className="block mb-1">الولاية</label>
        <select
          {...register("wilaya", { required: "الرجاء تحديد الولاية" })}
          className={`w-full border p-2 rounded-md ${
            errors.wilaya ? "border-red-500" : ""
          }`}
          disabled={loadingCities.wilayas}
        >
          <option value="">اختر الولاية</option>
          {wilayas.map((w) => (
            <option key={w.wilaya_code} value={w.wilaya_code}>
              {w.wilaya_name}
            </option>
          ))}
        </select>
        {errors.wilaya && (
          <p className="text-red-500 text-sm mt-1">{errors.wilaya.message}</p>
        )}
      </div>

      {/* Daira Dropdown */}
      <div>
        <label className="block mb-1">الدائرة</label>
        <select
          {...register("daira", { required: "الرجاء تحديد الدائرة" })}
          className={`w-full border p-2 rounded-md ${
            errors.daira ? "border-red-500" : ""
          }`}
          disabled={!selectedWilaya || loadingCities.dairas}
        >
          <option value="">اختر الدائرة</option>
          {dairas.map((d) => (
            <option key={d.daira_name_ascii} value={d.daira_name_ascii}>
              {d.daira_name}
            </option>
          ))}
        </select>
        {errors.daira && (
          <p className="text-red-500 text-sm mt-1">{errors.daira.message}</p>
        )}
      </div>

      {/* Commune Dropdown */}
      {selectedDaira && (
        <div>
          <label className="block mb-1">البلدية</label>
          <select
            {...register("commune", { required: "الرجاء تحديد البلدية" })}
            className={`w-full border p-2 rounded-md ${
              errors.commune ? "border-red-500" : ""
            }`}
            disabled={loadingCities.communes}
          >
            <option value="">اختر البلدية</option>
            {communes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.commune_name}
              </option>
            ))}
          </select>
          {errors.commune && (
            <p className="text-red-500 text-sm mt-1">
              {errors.commune.message}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
