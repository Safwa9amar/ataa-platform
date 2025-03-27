"use client";
import React, { useState } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import { IconButton } from "@material-tailwind/react";
import CONSTANTS from "@/config/constants";
import Todo from "@/components/UI/Todo";

export default function SearchFilter({
  handleChanges,
  submit = true,
  search,
  query,
  value,
  placeholder = "فرص تبرع، حملات...",
  withFilter = true,
  filter,
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen((prevOpen) => !prevOpen);

  // Get the filter component from CONSTANTS based on `search` and `query`
  const filterComponent =
    CONSTANTS.DONATION_TAB_DATA.find(
      (item) => item.name === search
    )?.data?.find((item) => item.name === query)?.filter || filter;

  return (
    <form className="relative">
      {withFilter && (
        <div className="absolute right-2 top-1">
          <IconButton
            onClick={handleOpen}
            variant="text"
            className="m-0 p-2 text-[#fff]"
          >
            <FaFilter className="text-textColor" size={22} />
          </IconButton>
          {filterComponent &&
            React.createElement(filterComponent, { handleOpen, open })}
        </div>
      )}
      <input
        name="keywords"
        onChange={handleChanges}
        dir="rtl"
        className="w-full dark:bg-gray-900 dark:bg-opacity-40 placeholder:text-slate-400 text-slate-700 text-sm rounded-full pl-28 pr-20 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        placeholder={placeholder}
        value={value}
      />
      <button
        onClick={submit}
        className="absolute top-2 left-2 flex items-center gap-2 rounded py-1 px-2.5"
        type={submit ? "button" : "submit"}
      >
        <FaSearch size={22} />
      </button>
    </form>
  );
}
