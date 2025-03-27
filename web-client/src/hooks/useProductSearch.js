import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { debounce } from "lodash"; // Ensure lodash is installed for debounce
import { useCredentials } from "@/context/CredentialsContext";

const useProductSearch = (fetchFunction, defaultLimit = 10) => {
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
  const limit = searchParams.get("limit") || defaultLimit;

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((text) => {
      const params = new URLSearchParams();
      params.set("keywords", text);
      params.set("page", 1); // Reset to the first page on new search
      params.set("limit", limit);
      router.replace(`${pathname}?${params.toString()}`);
    }, 1000),
    [limit, pathname, router]
  );

  // Fetch data based on query parameters
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchFunction(keywords, page, limit, userToken);
      setData(data || []); // Assuming the API returns an object with `products` and `totalPages`
      setTotalPages(data.totalPages || 1); // Set total pages for pagination
    } catch (err) {
      setError("فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [keywords, page, limit, userToken, fetchFunction]);

  // Fetch data when query parameters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    totalPages,
    keywords,
    page,
    limit,
    handleSearch,
    fetchData, // Optional: Expose fetchData for manual refetching
  };
};

export default useProductSearch;
