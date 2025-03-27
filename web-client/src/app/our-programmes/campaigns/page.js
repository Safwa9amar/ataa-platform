import React from "react";
import Button from "@/components/UI/Button";
import Typography from "@/components/UI/Typography";
import Image from "next/image";
import Link from "next/link";
import HeroSection from "./HeroSection";

export const metadata = {
  title: "إنشاء حملة تبرعات | منصة عطاء",
  description:
    "بادر بإنشاء حملة تبرعات عبر منصة عطاء وشارك في التعاون والتكافل لتحقيق أثر إيجابي في حياة الآخرين.",
  keywords:
    "تبرعات, حملات تبرعات, العمل الخيري, منصة عطاء, إنشاء حملة, جمع التبرعات",
  author: "منصة عطاء",
  openGraph: {
    type: "website",
    title: "إنشاء حملة تبرعات | منصة عطاء",
    description:
      "بادر بإنشاء حملة تبرعات عبر منصة عطاء وشارك في التعاون والتكافل لتحقيق أثر إيجابي في حياة الآخرين.",
    image: "/images/campaigeBG.png",
    url: "https://ataa-platform.com/our-programmes/campaigns/create",
    siteName: "منصة عطاء",
  },
  twitter: {
    card: "summary_large_image",
    title: "إنشاء حملة تبرعات | منصة عطاء",
    description:
      "بادر بإنشاء حملة تبرعات عبر منصة عطاء وشارك في التعاون والتكافل لتحقيق أثر إيجابي في حياة الآخرين.",
    image: "/images/campaigeBG.png",
  },
};

export default function Page() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Benefits Section */}
      <section className="py-10  text-center" dir="rtl">
        <Typography className="text-2xl md:text-4xl font-ElMessiri mb-6 dark:text-white">
          لماذا تختار منصة عطاء؟
        </Typography>
        <div className="flex flex-wrap justify-center gap-10 px-4">
          {[
            {
              title: "سهولة الإنشاء",
              description:
                "إنشاء حملة جمع التبرعات في خطوات بسيطة وسريعة دون الحاجة إلى خبرة تقنية.",
              icon: "/images/easy-icon.png",
            },
            {
              title: "الوصول إلى المجتمع",
              description:
                "فرصة لمشاركة حملتك مع الآلاف من الأشخاص المهتمين بدعم الأعمال الخيرية.",
              icon: "/images/community-icon.jpg",
            },
            {
              title: "مجالات متنوعة",
              description:
                "إمكانية اختيار المجالات الخيرية التي تريد جمع التبرعات لها بما يناسب اهتماماتك.",
              icon: "/images/charity-icon.jpeg",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white dark:bg-gray-700 dark:shadow-lg p-6 rounded-lg shadow-md max-w-xs"
            >
              <Image
                src={item.icon}
                alt={item.title}
                width={80}
                height={80}
                className="mb-4"
              />
              <Typography className="text-xl font-bold dark:text-white">
                {item.title}
              </Typography>
              <Typography className="text-gray-600 dark:text-gray-300">
                {item.description}
              </Typography>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-10  text-center" dir="rtl">
        <Typography className="text-2xl md:text-4xl font-ElMessiri mb-6 dark:text-white">
          كيف تعمل المنصة؟
        </Typography>
        <div className="flex flex-wrap justify-center gap-10 px-4">
          {[
            {
              step: "1",
              title: "إنشاء حملتك",
              description:
                "اختر هدفك، حدد التفاصيل، وأضف الصور والمعلومات الأساسية.",
            },
            {
              step: "2",
              title: "نشر الحملة",
              description:
                "شارك حملتك مع أصدقائك وعائلتك عبر وسائل التواصل الاجتماعي.",
            },
            {
              step: "3",
              title: "جمع التبرعات",
              description:
                "شاهد الدعم يتدفق إلى حملتك وحقق هدفك بسهولة وشفافية.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-xs"
            >
              <div className="text-green-500 dark:text-green-300 text-3xl font-bold mb-4">
                {item.step}
              </div>
              <Typography className="text-xl font-bold dark:text-white">
                {item.title}
              </Typography>
              <Typography className="text-gray-600 dark:text-gray-300">
                {item.description}
              </Typography>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="bg-green-500 dark:bg-green-700 bg-homeDoantionStatisBg bg-contain bg-fixed text-white text-center"
        dir="rtl"
      >
        <div className="w-full h-full bg-gray-900 bg-opacity-75 py-10">
          <Typography className="text-2xl md:text-4xl font-ElMessiri mb-6">
            مستعد لإنشاء حملتك؟
          </Typography>
          <Typography className="text-md md:text-xl font-ElMessiri mb-6">
            لا تفوت الفرصة للمساهمة في تغيير العالم من حولك. ابدأ الآن واجعل
            عطاؤك يصل إلى الجميع.
          </Typography>
          <Link href={"/our-programmes/campaigns/create"}>
            <Button color="white" className="rounded-full w-40">
              ابدأ الآن
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
