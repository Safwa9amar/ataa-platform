import { useRef } from "react";

const useDebouncedSearch = (fetchDataCallback, delay = 1000) => {
  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  const handleSearch = (event) => {
    const query = event.target.value;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Abort previous fetch request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController instance
    const newAbortController = new AbortController();
    abortControllerRef.current = newAbortController;

    // Set a new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        console.log("User stopped typing, fetching data...");
        await fetchDataCallback(query, newAbortController.signal);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Fetch error:", error);
        }
      }
    }, delay);
  };

  return handleSearch;
};

export default useDebouncedSearch;
