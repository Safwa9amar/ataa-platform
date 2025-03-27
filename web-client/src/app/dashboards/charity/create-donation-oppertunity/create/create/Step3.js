import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input, Button, Collapse, Typography } from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import { useFieldCategoryContext } from "@/context/FieldCategoryContext";

export default function Step3({ onSubmit }) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const { fields, categories, setSelectedField } = useFieldCategoryContext();

  const [open, setOpen] = useState(false);
  const CampaignType = watch("CampaignType");
  const campaignStatus = watch("campaignStatus");
  const fieldId = watch("fieldId");

  useEffect(() => {
    setSelectedField(fieldId);
  }, [fieldId]);

  return (
    <motion.div
      className="space-y-4 grid grid-cols-[550px]"
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Typography className="text-center" variant="lead">
        معلومات الحملة
      </Typography>
      {/* Campaign Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm mb-4">حالة الحملة</p>
        <select
          className="w-full border border-borderColor p-2 rounded-md"
          {...register("campaignStatus", {
            required: "يرجى تحديد حالة الحملة",
          })}
        >
          <option value="">اختر الحالة</option>
          <option value="URGENT">مستعجلة</option>
          <option value="NOT_URGENT">غير مستعجلة</option>
          <option value="ONGOING">صدقة جارية</option>
        </select>
        {errors.campaignStatus && (
          <p className="text-red-500 text-sm">
            {errors.campaignStatus.message}
          </p>
        )}
      </motion.div>

      {/* Conditional Fields for Ongoing Campaigns */}
      <AnimatePresence>
        {campaignStatus === "ONGOING" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.3 }}
          >
            <select
              className="w-full border border-borderColor p-2 rounded-md"
              {...register("fieldId", { required: "يرجى اختيار المجال" })}
            >
              <option value="">اختر المجال</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.ar_title}
                </option>
              ))}
            </select>
            {errors.fieldId && (
              <p className="text-red-500 text-sm">{errors.fieldId.message}</p>
            )}
            <br />
            <br />

            {categories.length > 0 && (
              <select
                className="w-full border border-borderColor p-2 rounded-md"
                {...register("categoryId", { required: "يرجى اختيار الصنف" })}
              >
                <option value="">اختر الصنف</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.ar_title}
                  </option>
                ))}
              </select>
            )}
            {errors.categoryId && (
              <p className="text-red-500 text-sm">
                {errors.categoryId.message}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conditional Fields for Other Campaigns */}
      <AnimatePresence>
        {campaignStatus !== "ONGOING" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.4 }}
          >
            <Input
              color="amber"
              type="number"
              label="عدد المستفيدين"
              {...register("numOfBeneficiaries", {
                valueAsNumber: true,
                required: "عدد المستفيدين مطلوب",
              })}
            />
            {errors.numOfBeneficiaries && (
              <p className="text-red-500 text-sm">
                {errors.numOfBeneficiaries.message}
              </p>
            )}
            <br />

            <div className="border-b border-steel w-full py-2">
              <p className="text-sm mb-4">المبلغ أو عدد الوحدات المستهدف</p>
              <select
                className="w-full border border-borderColor p-2 rounded-md"
                {...register("CampaignType", {
                  required: "يرجى تحديد نوع الحملة",
                })}
              >
                <option value="">اختر النوع</option>
                <option value="MONEY">مبلغ</option>
                <option value="GOODS">وحدات</option>
              </select>
              {errors.CampaignType && (
                <p className="text-red-500 text-sm">
                  {errors.CampaignType.message}
                </p>
              )}
            </div>

            <AnimatePresence>
              {CampaignType === "MONEY" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <Input
                    color="amber"
                    type="number"
                    label="المبلغ بالدينار الجزائري"
                    {...register("targetAmount", { valueAsNumber: true })}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {CampaignType === "GOODS" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <Input
                    color="amber"
                    type="number"
                    label="عدد الوحدات"
                    {...register("numberOfUnits", {
                      valueAsNumber: true,
                      required: "عدد الوحدات مطلوب",
                    })}
                  />
                  {errors.numberOfUnits && (
                    <p className="text-red-500 text-sm">
                      {errors.numberOfUnits.message}
                    </p>
                  )}
                  <br />

                  <Input
                    color="amber"
                    type="number"
                    label="سعر الوحدة بالدينار الجزائري"
                    {...register("unitPrice", {
                      valueAsNumber: true,
                      required: "سعر الوحدة مطلوب",
                    })}
                  />
                  {errors.unitPrice && (
                    <p className="text-red-500 text-sm">
                      {errors.unitPrice.message}
                    </p>
                  )}
                  <br />
                  <Input
                    color="amber"
                    disabled
                    label="المبلغ الإجمالي للوحدات بالدينار الجزائري"
                    value={watch("numberOfUnits") * watch("unitPrice") || 0}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <br />
            <Input
              color="amber"
              type="text"
              label="رقم الحساب البنكي أو البريدي للحملة"
              {...register("bankAccount", {
                required: "الحساب البنكي مطلوب",
              })}
            />
            {errors.bankAccount && (
              <p className="text-red-500 text-sm">
                {errors.bankAccount.message}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsible Section for Bank Account Owner */}
      {campaignStatus !== "ONGOING" && (
        <>
          <motion.button
            type="button"
            onClick={() => setOpen(!open)}
            className="px-4 py-2 text-lg font-ReemKufi bg-blue-gray-600 text-white rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            في حالة لم يكن صاحب الحساب البنكي هو صاحب الحساب على المنصة
          </motion.button>
          <Collapse open={open} className="flex flex-col gap-4">
            <Input
              color="amber"
              label="اسم صاحب الحساب"
              {...register("ownerName")}
            />
            <Input
              color="amber"
              type="text"
              label="رقم بطاقة التعريف"
              {...register("ownerID")}
            />
            <Input
              color="amber"
              type="text"
              label="رقم الهاتف"
              {...register("ownerPhone")}
            />
            <Input
              color="amber"
              type="email"
              label="البريد الإلكتروني"
              {...register("ownerEmail")}
            />
          </Collapse>
        </>
      )}
    </motion.div>
  );
}
