"use client";
import React from "react";
import Button from "@/components/UI/Button";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

export default function HeroSection() {
  const { ref: titleRef, inView: titleInView } = useInView({
    triggerOnce: false,
  });
  const { ref: descriptionRef, inView: descriptionInView } = useInView({
    triggerOnce: false,
  });
  const { ref: imageRef, inView: imageInView } = useInView({
    triggerOnce: false,
  });

  return (
    <section
      className="flex flex-col-reverse items-center p-2 md:p-10 rounded-lg mx-2"
      dir="rtl"
    >
      <div className="flex flex-col gap-5 items-center md:w-1/2 text-center">
        <p
          ref={titleRef}
          className={`text-lg md:text-4xl font-ElMessiri ${
            titleInView ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          تعرف على برنامج الزكاة واحسب زكاتك بسهولة
        </p>

        <p
          ref={descriptionRef}
          className={`text-md md:text-xl font-ElMessiri text-gray-600 ${
            descriptionInView ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          من خلال برنامج الزكاة، يمكنك حساب مقدار الزكاة المستحق بناءً على
          الذهب، الفضة، الأموال، والممتلكات الأخرى.
        </p>
      </div>

      <Image
        ref={imageRef}
        className={`${imageInView ? "animate-fadeIn" : "opacity-0"}`}
        src={
          "https://cdni.iconscout.com/illustration/premium/thumb/les-musulmans-donnant-zakat-7224385-5899128.png?f=webp"
        }
        width={500}
        height={500}
        alt="صورة برنامج الزكاة"
      />
    </section>
  );
}
