"use client";
import React from "react";
import PropTypes from "prop-types";
import { useAlgeriaCitiesContext } from "@/context/AlgeriaCitiesContext";

/**
 * WilayaSelect component for selecting a Wilaya from a dropdown.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.wilayas - The list of wilayas to select from.
 * @param {Function} props.onWilayaChange - The function to call when the selected Wilaya changes.
 *
 * @returns {JSX.Element} Rendered WilayaSelect component.
 */
const WilayaSelect = ({ onWilayaChange, wilaya = "01" }) => {
  const { wilayas } = useAlgeriaCitiesContext();

  return (
    <div className="flex flex-col gap-1 p-2 w-72">
      <label className="text-textColor font-ElMessiri">الولاية</label>
      <select
        className="px-4 py-2 border border-steel rounded-lg"
        onChange={(e) => onWilayaChange(e.target.value)}
        defaultValue={wilaya}
      >
        {wilayas
          .sort((a, b) => a.wilaya_code - b.wilaya_code) // Sort wilayas by code
          .map((wilaya, index) => (
            <option
              className="bg-mangoBlack"
              key={index}
              value={wilaya.wilaya_code}
            >
              {wilaya.wilaya_code} - {wilaya.wilaya_name}
            </option>
          ))}
      </select>
    </div>
  );
};

// PropTypes for validation
WilayaSelect.propTypes = {
  wilayas: PropTypes.arrayOf(
    PropTypes.shape({
      wilaya_code: PropTypes.number.isRequired,
      wilaya_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onWilayaChange: PropTypes.func.isRequired,
};

export default WilayaSelect;
