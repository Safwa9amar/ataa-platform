"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchFilter({
  handleChanges,
  submit = true,
  value,
  placeholder = "فرص تبرع، حملات...",
}) {
  const [open, setOpen] = useState(false);

  return (
    <form className="relative">
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
