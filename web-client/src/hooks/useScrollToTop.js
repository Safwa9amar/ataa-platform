import { useCallback } from "react";

const useScrollToTop = () => {
  const scrollToTop = useCallback((selector = "window") => {
    if (selector === "window") {
      // Scroll the window to the top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Scroll a specific element to the top
      const element = document.querySelector(selector);
      if (element) {
        element.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, []);

  return scrollToTop;
};

export default useScrollToTop;
