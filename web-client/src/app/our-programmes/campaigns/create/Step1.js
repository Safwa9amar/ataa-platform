import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
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
import { motion } from "framer-motion";

export default function Step1() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="space-y-5"
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Typography className="text-center" variant="lead">
        معلومات الاتصال
      </Typography>
      {/* Name Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Input
          color="amber"
          label="الاسم الكامل"
          variant="standard"
          {...register("name", { required: "الاسم الكامل مطلوب" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </motion.div>

      {/* Email Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Input
          color="amber"
          dir="ltr"
          label="البريد الالكتروني"
          variant="standard"
          {...register("email", {
            required: "البريد الالكتروني مطلوب",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "يرجى إدخال بريد إلكتروني صالح",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </motion.div>

      {/* Phone Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Input
          color="amber"
          dir="ltr"
          label="رقم الهاتف"
          variant="standard"
          {...register("phone", {
            required: "رقم الهاتف مطلوب",
            pattern: {
              value: /^[0-9]{10,15}$/,
              message: "يرجى إدخال رقم هاتف صالح",
            },
          })}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </motion.div>

      {/* Title Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Input
          color="amber"
          label="عنوان الحملة"
          variant="standard"
          {...register("title", { required: "عنوان الحملة مطلوب" })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </motion.div>

      {/* Markdown Guide Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={() => setOpen(true)}
          className="px-4 py-2 text-lg font-ReemKufi bg-teal-600 text-white rounded-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          تدعم منصة عطاء خاصية Markdown لتنسيق النصوص، يمكنك الاطلاع على الدليل
          من هنا
        </motion.button>
      </motion.div>

      {/* Description Textarea */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Textarea
          color="amber"
          label="وصف الحملة"
          className="min-h-[400px]"
          {...register("description", { required: "وصف الحملة مطلوب" })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </motion.div>

      {/* Dialog Modal */}
      <Dialog
        className="h-[560px] overflow-y-auto"
        dir="rtl"
        handler={setOpen}
        open={open}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>تنسيق النصوص في منصة عطاء</DialogHeader>
          <DialogBody>
            <MarkdownGuide />
          </DialogBody>
        </motion.div>
      </Dialog>
    </motion.div>
  );
}
