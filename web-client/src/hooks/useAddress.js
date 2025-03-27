import { useEffect, useState } from "react";
import { useAlgeriaCitiesContext } from "@/context/AlgeriaCitiesContext";
import { Spinner } from "@material-tailwind/react";
export const useAddress = (w, d) => {
  const [selectedWilaya, setSelectedWilaya] = useState(w || "");
  const [selectedDaira, setSelectedDaira] = useState(d || "");
  const { wilayas, dairas, communes, fetchDairas, fetchCommunes } =
    useAlgeriaCitiesContext();

  // Fetch dairas and communes whenever wilaya or daira changes
  useEffect(() => {
    fetchDairas(selectedWilaya);
    selectedWilaya && fetchCommunes(selectedWilaya, selectedDaira);
  }, [selectedWilaya, selectedDaira]);

  // Render dropdown using <select> and <option>
  const renderDropdown = (
    label,
    data,
    valueField,
    value,
    labelField,
    handleChange,
    isLoading
  ) => (
    <div key={value} className="mb-4">
      <label
        htmlFor={labelField}
        className="flex justify-between text-gray-700 "
      >
        {label}
        {isLoading && <Spinner className="h-5 w-5" color="amber" />}
      </label>
      <select
        disabled={isLoading}
        id={labelField}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        <option value={""}></option>
        {data?.map((item) => (
          <option key={item[valueField]} value={item[valueField]}>
            {item[labelField]}
          </option>
        ))}
      </select>
    </div>
  );
  return {
    wilayas,
    dairas,
    communes,
    renderDropdown,
    setSelectedWilaya,
    setSelectedDaira,
  };
};
