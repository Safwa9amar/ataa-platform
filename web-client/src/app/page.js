"use client";

import Link from "next/link";
import HomeTabs from "../components/layouts/homePage/HomeTabs";
import { CarouselDefault } from "../components/UI/HomeSlider";
import PageContainer from "../components/UI/PageContainer";
import API_ENDPOINTS from "../config/apiEndPoints";
import HomeCarousel from "../components/layouts/homePage/HomeCarousel";
import { Suspense, useEffect, useState } from "react";
import StatisticCard from "../components/layouts/homePage/StatisticCard";
import Image from "next/image";
import { useCredentials } from "@/context/CredentialsContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Spinner } from "@material-tailwind/react";
import { getCommonHeaders } from "@/services/getCommonHeaders";

export default function Home() {
  const {
    userToken,
    user,
    isLoggedIn,
    loading: UserLoading,
  } = useCredentials();
  const router = useRouter();
  const [supervisory, setSupervisory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState([]);
  const [carouselData, setCarouselData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [supervisoryRes, statsRes, carouselRes] = await Promise.all([
        fetch(API_ENDPOINTS.SUPERVISORYAUTHORITIES.GET_ALL).then((res) =>
          res.json()
        ),
        axios.get(API_ENDPOINTS.GET_STATISTICS).then((res) => res.data.data),
        axios
          .get(API_ENDPOINTS.HOME_CAROUSEL_DATA, {
            headers: getCommonHeaders(userToken),
          })
          .then((res) => res.data),
      ]);
      setSupervisory(supervisoryRes);
      setStatistics(statsRes);
      setCarouselData(carouselRes);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setError("حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      isLoggedIn &&
      user?.registrationStatus !== "COMPLETED" &&
      !UserLoading
    ) {
      router.replace("/account/register/type");
    }
    fetchData();
  }, [user, isLoggedIn]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner className="h-16 w-16" color="teal" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <CarouselDefault data={carouselData} className="h-[33vh] md:h-[70vh]" />
      <h1 className="font-ReemKufi text-xl md:text-4xl my-10 text-teal-300 dark:text-teal-800">
        ﴾ وَأَحْسِنُوا إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ ﴿
      </h1>
      <HomeCarousel />
      <Suspense fallback={<Spinner color="teal" className="w-10 h-10" />}>
        <HomeTabs />
        <Link
          href={
            user.role === "partner"
              ? "/donations-store/oppertunities"
              : "/donation-opportunities"
          }
          className="self-center text-md mb-5 md:text-lg bg-teal-300 dark:bg-teal-800 hover:scale-110 transition-transform text-white rounded-full px-10 py-2 hover:shadow-lg"
        >
          عرض المزيد من فرص التبرع
        </Link>
      </Suspense>
      <h1 className="text-center md:text-3xl">الجهات الاشرافية لمنصة عطاء</h1>
      <div className="w-[90%] bg-homeSuperVisorAuth bg-fixed bg-cover rounded-2xl">
        <div className="w-full h-full bg-gray-900 py-20 rounded-2xl bg-opacity-75 flex justify-around flex-wrap">
          {error ? (
            <p className="text-white">{error}</p>
          ) : supervisory.length > 0 ? (
            supervisory.map((item, index) => (
              <Image
                key={index}
                width={100}
                height={100}
                src={item.logo}
                alt={`شعار ${item.name} - الجهة الإشرافية`}
                className="h-16 w-16 md:h-32 md:w-32 rounded-full mx-auto"
              />
            ))
          ) : (
            <p className="text-white">لا توجد بيانات متاحة.</p>
          )}
        </div>
      </div>
      <h1 className="text-center md:text-3xl">عطاء في أرقام</h1>
      <div className="w-[90%] flex flex-col md:grid md:grid-cols-3 gap-6">
        <StatisticCard
          ratio={10}
          color="red"
          title="إجمالي التبرعات"
          value={`${statistics.totalDonatedAmount} دج`}
          icon="/images/graph.png"
          duration={0.3}
        />
        <StatisticCard
          ratio={10}
          color="red"
          title="عدد المستفيدين"
          value={statistics.totalNumberOfBeneficiaries}
          icon="/images/graph2.png"
          duration={0.2}
        />
        <StatisticCard
          ratio={10}
          color="red"
          title="عدد عمليات التبرع"
          value={statistics.totalDonations}
          icon="/images/graph3.png"
          duration={0.1}
        />
      </div>
      <Link
        href="/statistics"
        className="self-center text-md mb-5 md:text-lg bg-teal-300 dark:bg-teal-800 hover:scale-110 transition-transform text-white rounded-full px-10 py-2 hover:shadow-lg"
      >
        تفاصيل الإحصائيات
      </Link>
      <h1 className="font-ReemKufi text-xl md:text-4xl my-4 mb-20 text-teal-300 dark:text-teal-800">
        ﴾ لَن تَنَالُوا الْبِرَّ حَتَّى تُنفِقُوا مِمَّا تُحِبُّونَ ﴿
      </h1>
    </div>
  );
}
