import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <main className="w-full h-full flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-4xl my-5">صفحة الاضاحي</h1>
        <p className="text-lg mb-5">الصفحة حاليا قيد التطوير</p>
        <Image width={200} height={150} src="/images/adahi.png" />
      </div>
    </main>
  );
}
