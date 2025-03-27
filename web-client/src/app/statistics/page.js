import API_ENDPOINTS from "@/config/apiEndPoints";
import axios from "axios";
import Link from "next/link";
import React from "react";
import { FaChevronCircleLeft } from "react-icons/fa";

export const dynamic = "force-dynamic";

export default async function page() {
  let stats = await (await axios.get(API_ENDPOINTS.GET_STATISTICS)).data;
  return (
    <div className="flex flex-col items-center gap-6 mt-20 px-5">
      <h1 className="font-ReemKufi text-3xl md:text-5xl text-primaryColor">
        شكرا لعطائكم
      </h1>
      <p className="text-lg md:text-xl text-gray-600">
        المبلغ الإجمالي المتبرع به عبر منصة عطاء
      </p>
      <p className="text-4xl md:text-6xl font-bold text-primaryColor" dir="rtl">
        {stats.data.totalDonatedAmount} دج
      </p>
      <p className="font-ReemKufi text-lg md:text-2xl text-secondaryColor mt-4">
        ﴿ مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا فَيُضَاعِفَهُ لَهُ
        أَضْعَافًا كَثِيرَةً ﴾
      </p>
      <h2 className="text-2xl md:text-4xl text-primaryColor mt-14">
        احصائيات عامة
      </h2>
      <div className="flex flex-wrap justify-center gap-5 mt-6 mb-20">
        <StateLinkItem
          title={stats.data.totalDonations}
          typeName="عملية"
          subTitle="عمليات التبرع"
        />
        <StateLinkItem
          title={stats.data.donationFields}
          typeName="مجال"
          subTitle="مجالات التبرع"
          icon={<FaChevronCircleLeft size={22} />}
          link="/statistics/Beneficiaries"
        />
        <StateLinkItem
          title={stats.data.completedOpportunities}
          typeName="فرصة"
          subTitle="الفرص المكتملة"
          icon={<FaChevronCircleLeft size={22} />}
          link="/statistics/completed-opportunities"
        />
      </div>
    </div>
  );
}

const StateLinkItem = ({ title, subTitle, typeName, link = "#", icon }) => {
  return (
    <Link
      href={link}
      dir="rtl"
      className="scale-95 hover:scale-100 border-2 border-borderColor bg-mangoBlack rounded-lg shadow-md p-6 flex flex-col items-center md:w-[300px] lg:w-[400px] transition-all duration-300"
    >
      <p className="text-secondaryColor text-lg">{subTitle}</p>
      <p className="font-bold text-2xl mt-2">{title}</p>
      <p className="text-gray-600">{typeName}</p>
      {icon ? <div className="self-end mt-4">{icon}</div> : null}
    </Link>
  );
};
