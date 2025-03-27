"use client";
import React, { useCallback, useEffect, useState } from "react";
import SearchWithMenu from "@/components/UI/SearchWithMenu";
import { useStore } from "@/context/StoreContext";
import StoreCard, {
  ProductCardStoreSkeletonLoader,
} from "@/components/layouts/StoreCard";
import { Button } from "@material-tailwind/react";
import { useCart } from "@/context/CartContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import API_ENDPOINTS from "@/config/apiEndPoints";
import Navbar from "./Navbar";
import {
  getAllProducts,
  searchProductsInCategory,
} from "@/services/storeService";
import { useCredentials } from "@/context/CredentialsContext";
import SearchFilter from "@/app/donation-opportunities/[search]/Search_Filter";
import { debounce } from "lodash";

export default function Shop({ searchParams }) {
  const { addToCart } = useCart();
  const { userToken } = useCredentials();
  const { current_category, keywords } = searchParams;

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const pathname = usePathname();

  const getProducts = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        let data = await searchProductsInCategory(
          current_category,
          keywords || "",
          page,
          9, // عدد المنتجات لكل صفحة
          userToken
        );

        if (data) {
          setProducts(data.products || []);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    },
    [current_category, keywords, userToken]
  );

  useEffect(() => {
    setCurrentPage(1); // إعادة تعيين الصفحة عند تغيير الفئة
    getProducts(1);
  }, [current_category, keywords]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    getProducts(newPage);
  };
  const handleSearch = debounce((text) => {
    router.replace(`${pathname}?keywords=${text}`);
  }, 1000);

  return (
    <div className="p-10" dir="rtl">
      <div className="grid md:grid-cols-[2fr_0.5fr] items-center gap-5">
        <Navbar />
        <SearchFilter
          handleChanges={(e) => handleSearch(e.target.value)}
          placeholder="البحث عن منتجات "
          className="w-full max-w-4xl place-self-center"
          withFilter={false}
        />
      </div>

      {/* عرض المنتجات */}
      <div className="flex flex-wrap gap-4 p-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <ProductCardStoreSkeletonLoader key={index} />
          ))
        ) : products.length ? (
          products.map((item) => (
            <div key={item.id} className="flex justify-center">
              <StoreCard
                id={item.id}
                title={item.name}
                price={item.price}
                image={
                  API_ENDPOINTS.UPLOADS + "/" + item.productImages[0]?.filename
                }
                handlePress={() => addToCart({ ...item, type: "store" })}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            لا توجد منتجات للعرض
          </p>
        )}
      </div>

      {/* أزرار التنقل بين الصفحات */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            color="gray"
          >
            السابق
          </Button>
          <span className="text-gray-700">
            {currentPage} من {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            color="gray"
          >
            التالي
          </Button>
        </div>
      )}
    </div>
  );
}
