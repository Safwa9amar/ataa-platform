import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";

const AmountFilter = ({ handleAmountChange }) => {
  return (
    <div className="w-72 flex items-center justify-between gap-2 border border-borderColor p-2 rounded-md">
      <label className="text-textColor font-ElMessiri flex items-center gap-2">
        <FaMoneyBillWave size={20} />
        <p>المبلغ المتبقي</p>
      </label>
      <select onChange={handleAmountChange}>
        {[1000, 2000, 3000, 4000, 5000].map((amount) => (
          <option key={amount} value={amount}>
            {amount} دج
          </option>
        ))}
      </select>
    </div>
  );
};

export default AmountFilter;
