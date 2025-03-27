"use client";
import { DonationCard } from "@/components/UI/DonationCard";
import Typography from "@/components/UI/Typography";
import { getAllDonationOpportunities } from "@/services/donationOpportunityService";
import SearchFilter from "./Search_Filter";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@material-tailwind/react";

export default function Page({ params }) {
  const [loading, setLoading] = useState(true);
  const queryParams = useSearchParams();
  const query = queryParams.get("query");
  const progress = queryParams.get("progress");
  const keywords = queryParams.get("keywords");
  const [data, setData] = useState("");

  const getData = async (query) => {
    try {
      setLoading(true);
      let data = await getAllDonationOpportunities(
        params.search,
        query || "all",
        "",
        keywords,
        progress ? parseInt(progress) : "",
        ""
      );
      if (data)
        setData(
          progress ? data : data.filter((item) => item?.progress?.rate < 100)
        );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    query === "completed" ? getData("all") : getData(query);
  }, [keywords, query]);

  return (
    <>
      {loading ? (
        <Spinner className="w-16 h-16 self-center m-10" color="teal" />
      ) : (
        <div className="min-h-[50vh] grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  gap-4  mt-4 w-full  md:p-5 rounded-md">
          {data.length ? (
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
