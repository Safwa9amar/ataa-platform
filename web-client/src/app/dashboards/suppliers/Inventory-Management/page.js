"use client";
import React from "react";
import { ProductsTable } from "./ProductsTable";
import { Typography } from "@material-tailwind/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchWithMenu from "@/components/UI/SearchWithMenu";
import { debounce } from "lodash";
import { useCredentials } from "@/context/CredentialsContext";
import { getMyProducts } from "@/services/storeService";
import { useState, useCallback } from "react";
import AddProductForm from "./AddProductForm";
import KPIcards from "./KPIcards";
import InventoryByCategoryChart from "./InventoryByCategoryChart";
import InventoryByProductChart from "./InventoryByProductChart";
import InventoryDepletionChart from "./InventoryDepletionChart";

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

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getMyProducts(keywords, page, limit, userToken);
      setData(data); // Assuming the API returns an object with `products` and `totalPages`
      setTotalPages(data.totalPages || 1); // Set total pages for pagination
    } catch (err) {
      setError("فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.");
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  }, [keywords, page, limit, userToken]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-wrap justify-between my-5">
        <div className="flex items-center gap-5">
          <SearchWithMenu
            placeholder="بحث عن منتج"
            onInputChange={(val) => handleSearch(val)}
          />
          <AddProductForm fetchProducts={fetchProducts} />
        </div>
        <div className="space-y-5">
          <Typography variant="lead" className="font-bold text-textColor">
            لوحة ادارة المخزون
          </Typography>
          <Typography className="mb-4 w-80 font-normal text-gray-600 md:w-full">
            مراقبة مستوى المخزون وتجنب نفاد البضائع
          </Typography>
        </div>
      </div>
      <KPIcards />
      <ProductsTable
        fetchProducts={fetchProducts}
        keywords={keywords}
        page={page}
        limit={limit}
        data={data}
        isLoading={isLoading}
        error={error}
        totalPages={totalPages}
      />
      <InventoryByCategoryChart />
      <InventoryByProductChart />
      <InventoryDepletionChart />
    </div>
  );
}
