"use client";

import { DonationCard } from "@/components/UI/DonationCard";
import Typography from "@/components/UI/Typography";
import { getMyDonationOpportunities } from "@/services/donationOpportunityService";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@material-tailwind/react";
import { useCredentials } from "@/context/CredentialsContext";

export default function Page() {
  const { userToken } = useCredentials();
  const queryParams = useSearchParams();
  const status = queryParams.get("status");
  const keywords = queryParams.get("keywords");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMyDonationOpportunities({
        status,
        keywords,
        userToken,
      });

      setData(response ?? []);
    } catch (error) {
      console.error("Error fetching donation opportunities:", error);
    } finally {
      setLoading(false);
    }
  }, [status, keywords, userToken]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <div className="w-full flex justify-center md:justify-end"></div>
      {loading ? (
        <Spinner className="w-16 h-16 self-center m-10" color="teal" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4 w-full md:p-5 rounded-md">
          {data.length > 0 ? (
            data.map((item) => <DonationCard key={item.id} data={item} />)
          ) : (
            <Typography variant="body2" className="text-gray-500 mt-4">
              لاتوجد فرص تبرع حاليا
            </Typography>
          )}
        </div>
      )}
    </>
  );
}
