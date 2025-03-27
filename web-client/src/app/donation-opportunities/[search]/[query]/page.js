"use client";
import {
  DonationCard,
  DonationCardSkeleton,
} from "@/components/UI/DonationCard";
import Typography from "@/components/UI/Typography";
import { getAllDonationOpportunities } from "@/services/donationOpportunityService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchFilter from "../Search_Filter";

export default function Page({ params }) {
  const searchParams = useSearchParams();
  const paramsObject = Object.fromEntries(searchParams.entries());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [keywords, setKeywrods] = useState("");

  const getData = async () => {
    setLoading(true);

    try {
      let data = await getAllDonationOpportunities(
        params.search,
        params.query,
        paramsObject,
        keywords,
        "",
        ""
      );
      if (data) setData(data);
    } catch (error) {
      error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [params.query, searchParams]);

  return (
    <>
      <div className="w-full flex justify-center md:justify-end">
        <SearchFilter
          handleChanges={(e) => setKeywrods(e.target.value)}
          submit={getData}
          {...params}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  gap-4  mt-4 w-full  md:p-5 rounded-md">
        {loading && (
          <>
            <DonationCardSkeleton />
            <DonationCardSkeleton />
            <DonationCardSkeleton />
          </>
        )}
        {data.length
          ? data.map((item) => <DonationCard key={item.id} data={item} />)
          : !loading && (
              <Typography variant="body2" className="text-gray-500 mt-4">
                لاتوجد فرص تبرع حاليا
              </Typography>
            )}
      </div>
    </>
  );
}
