import React from "react";

const SortByFilter = ({ sortBy, handleSortByChange }) => {
  return (
    <div className="flex flex-col gap-1 p-2 w-72">
      <label className="text-textColor font-ElMessiri">ترتيب حسب</label>
      <select
        className="px-4 py-2 border border-steel rounded-lg"
        onChange={handleSortByChange}
      >
        <option value="old">الاقدم</option>
        <option value="new">الاحدث</option>
      </select>
    </div>
  );
};

export default SortByFilter;
