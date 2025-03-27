"use client";
import React from "react";

const SectionHeader = ({ title, description }) => (
  <div className="mb-6 text-right">
    <h2 className="font-bold text-textColor text-md  md:text-2xl">{title}</h2>
    <p className="text-gray-600 mt-2 text-sm">{description}</p>
  </div>
);

export default SectionHeader;
