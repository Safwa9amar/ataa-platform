import CONSTANTS from "@/config/constants";
import { useFieldCategoryContext } from "@/context/FieldCategoryContext";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Step3 = () => {
  const {
    register,
    watch,
    getValues,
    formState: { errors },
  } = useForm();
    const {
      setSelectedField,
      categories,
    } = useFieldCategoryContext();
    
    const subcategory = "Housing"   
    const field = watch("field");
    const category = getValues();
    console.log(category);
    
    
    useEffect(() => {
      setSelectedField(field);
    }, [field]);


  const renderField = (field) => {
    switch (field.type) {
      case "select":
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-gray-700 mb-2">{field.label}</label>
            <select
              {...register(field.name, { required: `${field.label} مطلوب` })}
              className="w-full p-2 border rounded"
            >
              <option value="">اختر {field.label}</option>
              {field.data.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        );

      case "text":
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-gray-700 mb-2">{field.label}</label>
            <input
              type="text"
              {...register(field.name, { required: `${field.label} مطلوب` })}
              className="w-full p-2 border rounded"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        );

      case "number":
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-gray-700 mb-2">{field.label}</label>
            <input
              type="number"
              {...register(field.name, {
                required: `${field.label} مطلوب`,
                min: { value: 0, message: "يجب أن يكون الرقم موجبًا" },
              })}
              className="w-full p-2 border rounded"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-gray-700 mb-2">{field.label}</label>
            <textarea
              {...register(field.name, { required: `${field.label} مطلوب` })}
              className="w-full p-2 border rounded"
              rows={4}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        );

      case "month":
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-gray-700 mb-2">{field.label}</label>
            <input
              type="month"
              {...register(field.name, { required: `${field.label} مطلوب` })}
              className="w-full p-2 border rounded"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name].message}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!CONSTANTS.subcategoryMap[subcategory]) {
    return <div>لا يوجد حقول محددة لهذه الفئة الفرعية</div>;
  }

  return (
    <div
      className="space-y-6 grid grid-cols-[500px] mx-auto"
      dir="rtl"
    >
      {CONSTANTS.subcategoryMap[subcategory].map((field) => renderField(field))}
    </div>
  );
};

export default Step3;

// Usage example:
// <DynamicForm subcategory="Projects" subcategoryMap={subcategoryMap} />
