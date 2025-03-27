import React from "react";
import COTabs from "./Tabs";
import { IoStatsChart } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import axios from "axios";
import API_ENDPOINTS from "@/config/apiEndPoints";

export const dynamic = "force-dynamic";

export default async function page() {
  let stats = await (await axios.get(API_ENDPOINTS.GET_STATISTICS)).data.data;


   return (
     <div className="mt-16">
       <div className="grid md:grid-flow-col-dense gap-2">
         <HeaderState
           icon={<IoStatsChart size={32} />}
           title={"اجمالي الفرص المكتملة"}
           description={stats.completedOpportunities}
           bg="bg-blue-200"
         />
         <HeaderState
           icon={<IoStatsChart size={32} />}
           title={"اجمالي الفرص المتبقية"}
           description={stats.remainingOpportunities}
           bg="bg-blue-300"
         />
         <HeaderState
           icon={<FaPeopleGroup size={32} />}
           title={"عدد المستفيدين"}
           description={stats.totalNumberOfBeneficiaries}
           bg="bg-blue-400"
         />
       </div>
       <COTabs />
     </div>
   );
}

const HeaderState = ({ title, description, icon, bg }) => {
  return (
    <div
      className={`text-textColor text-center p-3 border-2 border-borderColor rounded-md shadow-sm ${bg}`}
    >
      <div className="flex gap-2 justify-center items-center">
        <p className="text-sm md:text-lg font-bold">{title}</p>
        {icon}
      </div>
      <p className="text-sm md:text-2xl">{description}</p>
    </div>
  );
};
