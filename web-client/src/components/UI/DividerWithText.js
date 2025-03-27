"use client";

import React from "react";

export default function DividerWithText({ children }) {
  return (
    <div className="flex items-baseline gap-4 w-full my-4">
      <div className="flex-grow border-t border-gray-400 border-dashed"></div>
      {children}
      <div className="flex-grow border-t border-gray-400 border-dashed"></div>
    </div>
  );
}
