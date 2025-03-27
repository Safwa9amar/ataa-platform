import React from "react";
import GivingPartners from "./GivingPartners";

export const metadata = {
  title: "شركاء عطاء",
};

export default function page() {
  return (
    <>
      <div className="textColor flex flex-col items-center justify-center gap-5 my-10">
        <h1 className="text-textColor text-3xl font-bold">شركاء عطاء</h1>
        <p className="text-secondaryTextColor text-center mb-10 max-w-xl">
          للخير وسائل متعددة، وأبواب الإحسان كثيرة. لهذا السبب، تقدم العديد من
          المؤسسات مبادرات وخدمات لمنصة عطاء
        </p>
      </div>
      <GivingPartners />
    </>
  );
}
