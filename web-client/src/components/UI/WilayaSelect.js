"use client";
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useAlgeriaCitiesContext } from "@/context/AlgeriaCitiesContext";
import { FiChevronDown, FiX, FiSearch } from "react-icons/fi";

const WilayaSelect = ({ onWilayaChange, wilaya = "01" }) => {
  const { wilayas } = useAlgeriaCitiesContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWilaya, setSelectedWilaya] = useState(wilaya);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Set initial selected wilaya
  useEffect(() => {
    if (wilaya) {
      const initialWilaya = wilayas.find((w) => w.wilaya_code === wilaya);
      if (initialWilaya) {
        setSelectedWilaya(initialWilaya.wilaya_code);
      }
    }
  }, [wilaya, wilayas]);

  const filteredWilayas = wilayas
    .sort((a, b) => a.wilaya_code - b.wilaya_code)
    .filter(
      (w) =>
        w.wilaya_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.wilaya_code.toString().includes(searchTerm)
    );

  const handleSelect = (wilayaCode) => {
    setSelectedWilaya(wilayaCode);
    onWilayaChange(wilayaCode);
    setIsOpen(false);
    setSearchTerm("");
  };

  const getSelectedWilayaName = () => {
    const selected = wilayas.find((w) => w.wilaya_code === selectedWilaya);
    return selected ? `${selected.wilaya_code} - ${selected.wilaya_name}` : "";
  };

  return (
    <div className="flex flex-col gap-1 w-72 relative" ref={dropdownRef}>
      <label className="text-textColor font-ElMessiri text-sm">الولاية</label>

      <div className="relative">
        <div
          className="flex items-center justify-between px-4 py-2 border border-steel rounded-lg cursor-pointer bg-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-ElMessiri truncate">
            {getSelectedWilayaName() || "اختر الولاية"}
          </span>
          <FiChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-steel rounded-lg shadow-lg max-h-80 overflow-auto">
            <div className="sticky top-0 bg-white p-2 border-b">
              <div className="relative">
                <FiSearch className="absolute right-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن الولاية..."
                  className="w-full pr-10 pl-2 py-2 border border-gray-200 rounded-md font-ElMessiri text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute left-3 top-3 text-gray-400"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredWilayas.length > 0 ? (
                filteredWilayas.map((wilaya) => (
                  <div
                    key={wilaya.wilaya_code}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-50 font-ElMessiri ${
                      selectedWilaya === wilaya.wilaya_code
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                    onClick={() => handleSelect(wilaya.wilaya_code)}
                  >
                    {wilaya.wilaya_code} - {wilaya.wilaya_name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-center font-ElMessiri">
                  لا توجد نتائج
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

WilayaSelect.propTypes = {
  onWilayaChange: PropTypes.func.isRequired,
  wilaya: PropTypes.string,
};

export default WilayaSelect;
