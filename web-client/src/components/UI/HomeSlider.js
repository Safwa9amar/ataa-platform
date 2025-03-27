"use client";
import { Button, Carousel, Typography } from "@material-tailwind/react";
import Link from "next/link";

export function CarouselDefault(props) {
  return (
    <Carousel autoplay loop {...props}>
      {props.data.map((item, index) => (
        <CarouselItem
          key={item.id}
          title={item.title}
          slideImage={item.slideImage}
          description={item.description}
          actionBtnTitle={item.actionBtnTitle}
          backgroundImage={item.backgroundImage}
          link={item.webLink}
        />
      ))}
    </Carousel>
  );
}

const CarouselItem = ({
  title,
  description,
  actionBtnTitle,
  backgroundImage,
  link,
}) => {
  return (
    <div
      style={{
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundImage: `url(${backgroundImage})`,
      }}
      className="flex flex-col items-center h-full w-full"
    >
      <div className="relative bg-gray-900 bg-opacity-75 w-full h-full p-10 rounded-2xl flex flex-col justify-center items-center">
        <Typography className="text-teal-500 text-lg md:text-[4.5rem] md:m-10 font-ElMessiri font-bold mt-5">
          {title}
        </Typography>
        <Typography
          variant="h5"
          className="text-[#FFF] md:w-1/2 text-center font-ElMessiri text-xs md:text-base lg:text-xl"
        >
          {description}
        </Typography>
        <Link
          href={link || "#"}
          className="bg-teal-700 text-center text-[#FFF] text-xs sm:text-base md:text-lg px-3 sm:px-4 py-2 rounded-full mt-4 w-28 sm:w-32 md:w-36 lg:w-40"
        >
          {actionBtnTitle}
        </Link>
      </div>
    </div>
  );
};
