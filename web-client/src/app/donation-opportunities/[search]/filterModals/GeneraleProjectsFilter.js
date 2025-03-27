"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import AgeFilter from "@/components/UI/AgeFilter";
import AmountFilter from "@/components/UI/AmountFilter";
import SortByFilter from "@/components/UI/SortByFilter";
import ActionButtons from "@/components/UI/ActionButtons";
import ToggleButtonGroup from "@/components/UI/ToggleButtonGroup";
import WilayaSelect from "@/components/UI/WilayaSelect";
import { IoMaleOutline } from "react-icons/io5";
import { IoIosFemale } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import PropTypes from "prop-types";

const genderOptions = [
  { label: "ذكر", value: "male", icon: IoMaleOutline },
  { label: "انثى", value: "female", icon: IoIosFemale },
];

const maritalStatusOptions = [
  { label: "متزوج", value: "maried" },
  { label: "اعزب", value: "single" },
];

const childrenOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "اكثر", value: "اكثر" },
];

const disabilityOptions = [
  { label: "نعم", value: true },
  { label: "لا", value: false },
];

export function GeneraleProjectsFilter({ open, handleOpen, setFilterData }) {
  const router = useRouter();
  const pathname = usePathname();

  const [filterData, setFilterDataState] = useState({
    wilaya: null,
    maritalStatus: null,
    disability: null,
    children: null,
    sortBy: null,
    amount: null,
    gender: null,
    age: 18,
  });

  const updateFilterData = (key, value) => {
    setFilterDataState((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const query = new URLSearchParams(filterData).toString();
    router.push(`${pathname}?${query}`);
    handleOpen();
  };

  const getButtonStyles = (condition) => ({
    variant: condition ? "gradient" : "outlined",
    color: condition ? "indigo" : "",
    className: `${
      condition ? "text-white" : "text-textColor"
    } font-ElMessiri flex items-center gap-2`,
  });

  return (
    <Dialog open={open} handler={handleOpen} dir="rtl">
      <DialogHeader className="bg-mangoBlack text-textColor font-ElMessiri rounded-lg text-lg md:text-3xl">
        تصفية وترتيب المشاريع
      </DialogHeader>
      <DialogBody
        divider
        className="space-y-4 bg-mangoBlack rounded-md p-5 overflow-y-scroll h-[30rem] md:h-full"
      >
        <WilayaSelect
          wilaya={filterData.wilaya}
          onWilayaChange={(value) => updateFilterData("wilaya", value)}
        />

        <ToggleButtonGroup
          options={{ label: "حدد الجنس", choices: genderOptions }}
          selectedOption={filterData.gender}
          setSelectedOption={(value) => updateFilterData("gender", value)}
          getButtonStyles={getButtonStyles}
        />

        <ToggleButtonGroup
          options={{
            label: "الحالة الاجتماعية",
            choices: maritalStatusOptions,
          }}
          selectedOption={filterData.maritalStatus}
          setSelectedOption={(value) =>
            updateFilterData("maritalStatus", value)
          }
          getButtonStyles={getButtonStyles}
        />

        <AgeFilter
          age={filterData.age}
          handleSliderChange={(e) =>
            updateFilterData("age", Math.floor(e.target.value))
          }
        />

        <ToggleButtonGroup
          options={{ label: "عدد الابناء", choices: childrenOptions }}
          selectedOption={filterData.children}
          setSelectedOption={(value) => updateFilterData("children", value)}
          getButtonStyles={getButtonStyles}
        />

        <AmountFilter
          amount={filterData.amount}
          handleAmountChange={(e) => updateFilterData("amount", e.target.value)}
        />

        <ToggleButtonGroup
          options={{ label: "مخصص لذوي الاعاقة", choices: disabilityOptions }}
          selectedOption={filterData.disability}
          setSelectedOption={(value) => updateFilterData("disability", value)}
          getButtonStyles={getButtonStyles}
        />

        <SortByFilter
          sortBy={filterData.sortBy}
          handleSortByChange={(e) => updateFilterData("sortBy", e.target.value)}
        />
      </DialogBody>
      <DialogFooter className="bg-mangoBlack">
        <ActionButtons handleOpen={handleOpen} applyFilters={applyFilters} />
      </DialogFooter>
    </Dialog>
  );
}

GeneraleProjectsFilter.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  setFilterData: PropTypes.func,
};
