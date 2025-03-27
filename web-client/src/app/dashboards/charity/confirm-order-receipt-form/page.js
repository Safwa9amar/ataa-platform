"use client";
import React from "react";
import { Typography } from "@material-tailwind/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchWithMenu from "@/components/UI/SearchWithMenu";
import { debounce } from "lodash";
import { useCredentials } from "@/context/CredentialsContext";
import { getMyProducts } from "@/services/storeService";
import { useState, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import { InvoiceTable } from "./InvoicesTable";

export default function page() {
  const { userToken } = useCredentials();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Get `keywords`, `page`, and `limit` from URL query parameters
  const keywords = searchParams.get("keywords") || "";
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;

  const handleSearch = debounce((text) => {
    const params = new URLSearchParams();
    params.set("keywords", text);
    params.set("page", page || 1);
    params.set("limit", limit || 10);
    router.replace(`${pathname}?${params.toString()}`);
  }, 2000);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        API_ENDPOINTS.DASHBOARDS.confirmInvoice + "/my-invoices",
        {
          headers: getCommonHeaders(userToken),
          params: {
            keywords,
            page,
            limit,
          },
        }
      );

      setData(response.data); // Assuming the API returns an object with `products` and `totalPages`
      setTotalPages(response.data.totalPages || 1); // Set total pages for pagination
    } catch (err) {
      setError("فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.");
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  }, [keywords, page, limit, userToken]);

  return (
    <div className="container min-h-[50vh] mx-auto">
      <div className="flex flex-wrap justify-between my-5">
        <div className="flex items-center gap-5">
          <SearchWithMenu
            placeholder="بحث عن فاتورة"
            onInputChange={(val) => handleSearch(val)}
          />
        </div>
        <div className="space-y-5">
          <Typography variant="lead" className="font-bold text-textColor">
            متابعة الفواتير
          </Typography>
        </div>
      </div>
      <InvoiceTable
        fetchInvoices={fetchInvoices}
        keywords={keywords}
        page={page}
        limit={limit}
        data={data}
        isLoading={isLoading}
        error={error}
        totalPages={totalPages}
      />
    </div>
  );
}
