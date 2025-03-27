import React, { Suspense } from "react";
import Fields, { CategorySkeletonLoader } from "./Fields";
import { DonationCardSkeleton } from "@/components/UI/DonationCard";
import ProjectsSvg from "@/components/vectors/ProjectsSvg";
import TayasrtSvg from "@/components/vectors/TayasrtSvg";
import ForejatSvg from "@/components/vectors/ForejatSvg";
import IghathaSvg from "@/components/vectors/IghathaSvg";

export const metadata = {
  title: "فرص التبرع",
};

export default async function page() {
  return (
    <div dir="rtl" className="flex flex-col gap-5">
      <Suspense
        fallback={
          <div>
            <CategorySkeletonLoader />
            <div className="flex">
              <DonationCardSkeleton />
              <DonationCardSkeleton />
              <DonationCardSkeleton />
            </div>
          </div>
        }
      >
        <Fields
          field={"Projects"}
          ar_title="مشاريع عامة"
          icon={<ProjectsSvg />}
          description={
            "ساهم في دعم المشاريع العامة التي تشمل تحسين البنية التحتية، توفير الإسكان، ورعاية الأيتام. تساعد هذه المشاريع في تحسين حياة الأفراد والمجتمعات الأكثر احتياجاً من خلال تبرعاتك الكريمة."
          }
        />
        <Fields
          field={"Tayasart"}
          icon={<TayasrtSvg />}
          ar_title="تيسرت"
          description={
            "مبادرة تهدف إلى تخفيف الأعباء المالية عن الأسر المحتاجة عبر تغطية فواتير الكهرباء، الماء، والغاز، ودعم الإعانات القضائية. ساهم في تحقيق استقرار أكبر للأسر المحتاجة من خلال التبرع."
          }
        />
        <Fields
          field={"Forejat"}
          icon={<ForejatSvg />}
          ar_title="فرجت"
          description={
            "تتيح مبادرة فرجت للمساهمين فرصة تسديد ديون السجناء ودعمهم للعودة إلى حياتهم الطبيعية مع أسرهم. ساهم في منح الأمل وتخفيف المعاناة."
          }
        />
        <Fields
          field={"Eghatha"}
          ar_title="إغاثة"
          icon={<IghathaSvg />}
          description={
            "ساعد في توفير الدعم الطارئ للأسر المتضررة من الكوارث الطبيعية والأزمات. تشمل المساعدات الغذائية والطبية والخدمات الأساسية، مما يعزز التكافل الاجتماعي."
          }
        />
      </Suspense>
    </div>
  );
}
