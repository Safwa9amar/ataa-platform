import { useStore } from "@/context/StoreContext";
import { Button } from "@material-tailwind/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 10,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 5,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
    slidesToSlide: 1, // optional, default to 1.
  },
};
export default function Navbar() {
  const { products, getALLProducts, searchProducts, loading, categories } =
    useStore();
  const currentCategory = useSearchParams().get("current_category") || "";
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Carousel
      swipeable={true}
      draggable={true}
      showDots={false}
      responsive={responsive}
      keyBoardControl={true}
      rtl
      transitionDuration={300}
      removeArrowOnDeviceType={["mobile"]}
      itemClass="min-w-fit mx-3"
    >
      {categories.map((cat) => (
        <Button
          className={`rounded-full min-w-fit ${
            currentCategory === cat.id ? "bg-teal-900" : "bg-transparent"
          }`}
          variant="outlined"
          color={"teal"}
          onClick={() =>
            router.replace(`${pathname}?current_category=${cat.id}`)
          }
        >
          {cat.name}
        </Button>
      ))}
    </Carousel>
  );
}
