"use client";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import { getCampaignById } from "@/services/campaignServices";
import { Spinner } from "@material-tailwind/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Campaign({ id }) {
  const { userToken } = useCredentials();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let fetchData = async () => {
      let res = await getCampaignById(id, userToken);

      setData(res);
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
      <p className="max-w-96 text-gray-800 truncate">{data.description}</p>
      <p className="max-w-96 text-gray-800 font-bold  ">
        المبلغ المجموع :{" "}
        <p className="text-green-900 inline">{data.progress.totalAmount} دج</p>
      </p>
      <p className="max-w-96 text-gray-800 font-bold  ">
        المبلغ المستهدف :{" "}
        <p className="text-indigo-900 inline">
          {data.progress.requiredAmount} دج
        </p>
      </p>
    </div>
  );
}
