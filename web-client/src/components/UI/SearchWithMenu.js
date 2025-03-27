"use client";

import React from "react";
import { FaSearch } from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import { usePathname } from "next/navigation";

const SearchWithMenu = ({
  menuItems = [],
  placeholder = "Search...",
  onSearch,
  onMenuItemClick,
  inputValue,
  onInputChange,
}) => {
  return (
    <div className="w-full text-right max-w-sm min-w-[250px]">
      <div className="relative">
        {/* Menu for settings icon */}
        {menuItems.length > 0 && (
          <div className="absolute right-2 top-1">
            <Menu
              animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
              }}
            >
              <MenuHandler>
                <IconButton variant="text" className="m-0 p-2 dark:text-white">
                  <VscSettings className="text-textColor" size={22} />
                </IconButton>
              </MenuHandler>
              <MenuList dir="rtl" className="bg-nav_bg text-textColor max-h-64">
                {menuItems.map((item, index) => (
                  <MenuItem key={index} onClick={() => onMenuItemClick(item)}>
                    {item}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </div>
        )}

        {/* Search input */}
        <input
          dir="rtl"
          className="overflow-hidden placeholder:text-xs  w-full dark:bg-gray-900 dark:bg-opacity-40 placeholder:text-slate-400 text-slate-700 text-sm rounded-full  pr-12 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
        />

        {/* Search button */}
        <button
          className="absolute top-3 left-2 flex items-center gap-2 rounded bg-slate-800 py-1 px-2.5"
          type="button"
          onClick={onSearch}
        >
          <FaSearch className="text-textColor" size={15} />
        </button>
      </div>
    </div>
  );
};

export default SearchWithMenu;
