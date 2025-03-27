import React from "react";
import Button from "@/components/UI/Button";
import Typography from "@/components/UI/Typography";
import Image from "next/image";
import Link from "next/link";
export default function HeroSection() {
  return (
    <section
      className="flex flex-col-reverse md:flex-row justify-between items-center bg-mangoBlack p-2 md:p-10 rounded-lg mx-2"
      dir="rtl"
    >
      <div className="flex flex-col gap-5 items-start md:w-1/2">
        <Typography className="text-lg md:text-4xl font-ElMessiri">
          بادر انشاء حملة تبرعات وانشرها ليصل عطائك الى من هم بأمس الحاجة اليه
        </Typography>
        <Typography className="text-md md:text-xl font-ElMessiri text-gray-600">
          تتيح لك منصة عطاء الفرصة لجمع التبرعات في مجالات خيرية مختلفة لتشارك
          في التعاون والتكافل وتكون فردا مؤثرا ذا بصمة طيبة في حياة اللآخرين{" "}
        </Typography>

        <Link href={"/our-programmes/campaigns/create"}>
          <Button color="green" className="rounded-full w-32">
            انشئ حملتك
          </Button>
        </Link>
      </div>
      <Image
        className="md:w-1/3"
        src={"/images/campaigeBG.png"}
        width={500}
        height={500}
      />
    </section>
  );
}
