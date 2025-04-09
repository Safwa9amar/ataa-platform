"use client";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { getDonationOpportunityById } from "@/services/donationOpportunityService";
import { Spinner } from "@material-tailwind/react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function DonationOpportunity({ id }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    let fetchData = async () => {
      let data = await getDonationOpportunityById(id);
      setData(data);
      router.replace(
        pathname +
          "?" +
          searchParams +
          "&remainingAmount=" +
          (data.progress.requiredAmount - data.progress.totalAmount)
      );
    };
    fetchData().finally(() => {
      setLoading(false);
    });
  }, []);
  return loading ? (
    <Spinner color="green" className="h-16 w-16" />
  ) : (
    <div className="flex flex-col items-stretch gap-5 my-4">
      <Image
        className="rounded-lg"
        src={API_ENDPOINTS.UPLOADS + "/" + data.images[0].filename}
        width={384}
        height={250}
      />
      <p className="max-w-96 text-xl font-bold">{data.title}</p>
      <p className="max-w-96 text-gray-800 dark:text-gray-400 ">
        {data.description}
      </p>
      <p className="max-w-96 text-gray-800  dark:text-gray-400 font-bold  ">
        المبلغ المجموع :{" "}
        <p className="text-green-900 dark:text-green-500 inline">
          {data?.progress?.totalAmount} دج
        </p>
      </p>
      <p className="max-w-96 text-gray-800  dark:text-gray-400 font-bold  ">
        المبلغ المستهدف :{" "}
        <p className="text-indigo-900 dark:text-indigo-400 inline">
          {data?.progress?.requiredAmount} دج
        </p>
      </p>
    </div>
  );
}
