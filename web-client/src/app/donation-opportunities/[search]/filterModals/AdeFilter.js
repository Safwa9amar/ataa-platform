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
const StatusOptions = [
  { label: "منقطعة", value: "maried" },
  { label: "ستنقطع", value: "single" },
];

export function AdeFilter({ open, handleOpen, setFilterData }) {
  const router = useRouter();
  const pathname = usePathname();

  const [filterData, setFilterDataState] = useState({
    wilaya: null,
    maritalStatus: null,
    status: null,
    sortBy: null,
    gender: null,
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
        تصفية وترتيب فرص تبرع فواتير المياه
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

        <ToggleButtonGroup
          options={{
            label: "الحالة ",
            choices: StatusOptions,
          }}
          selectedOption={filterData.StatusOptions}
          setSelectedOption={(value) =>
            updateFilterData("StatusOptions", value)
          }
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

AdeFilter.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  setFilterData: PropTypes.func,
};
