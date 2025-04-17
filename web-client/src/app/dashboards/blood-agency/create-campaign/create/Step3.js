import { useFormContext, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import { Input } from "@material-tailwind/react";
import { useEffect } from "react";

const Step2 = () => {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();

  const truckCount = watch("truckCount");

  // handle dynamic locations array based on truckCount
  const { fields, append, remove } = useFieldArray({
    control,
    name: "truckLocations",
  });

  useEffect(() => {
    const currentCount = fields.length;

    if (truckCount > currentCount) {
      for (let i = currentCount; i < truckCount; i++) {
        append({ location: "" });
      }
    } else if (truckCount < currentCount) {
      for (let i = currentCount; i > truckCount; i--) {
        remove(i - 1);
      }
    }
  }, [truckCount]);

  return (
    <div className="space-y-6 grid grid-cols-[500px] mx-auto" dir="rtl">
      <h1 className="text-xl font-bold">تفاصيل الشاحنات والموقع</h1>

      <motion.div
        key="truckCount"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Input
          {...register("truckCount", {
            required: "الرجاء تحديد عدد الشاحنات",
            min: {
              value: 1,
              message: "يجب إدخال شاحنة واحدة على الأقل",
            },
            valueAsNumber: true,
          })}
          variant="outlined"
          color={errors.truckCount ? "red" : "teal"}
          placeholder="أدخل عدد الشاحنات"
          label="عدد الشاحنات"
          type="number"
        />
        {errors.truckCount && (
          <p className="text-red-500 text-sm">{errors.truckCount.message}</p>
        )}
      </motion.div>

      {/* locations inputs */}
      {fields.map((field, index) => (
        <motion.div
          key={field.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Input
            {...register(`truckLocations.${index}.location`, {
              required: `الرجاء إدخال الموقع الخاص بالشاحنة رقم ${index + 1}`,
            })}
            variant="outlined"
            color={
              errors.truckLocations?.[index]?.location ? "red" : "teal"
            }
            placeholder={`أدخل موقع الشاحنة رقم ${index + 1}`}
            label={`موقع الشاحنة رقم ${index + 1}`}
          />
          {errors.truckLocations?.[index]?.location && (
            <p className="text-red-500 text-sm">
              {errors.truckLocations[index].location.message}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default Step2;
