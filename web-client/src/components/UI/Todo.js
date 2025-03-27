import React from "react";

export default function Todo({ title, children }) {
  return (
    <div className="border-2 border-deep-orange-800 relative p-5 rounded-md">
      <p className="absolute text-sm -top-5 left-0">TODO : {title}</p>
      {children}
    </div>
  );
}
