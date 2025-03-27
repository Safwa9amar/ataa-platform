import React from "react";
import RednderCards from "./RednderCards";

function SubscriptionPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-12"
    >
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          اختر باقتك المثالية
        </h1>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12">
          استكشف خطط الاشتراك المختلفة واختر الخطة التي تناسب احتياجاتك. جميع
          الباقات تقدم قيمة استثنائية، مصممة خصيصًا لتلبية متطلبات الأفراد
          والشركات.
        </p>
        <div className="flex flex-wrap items-center justify-center  gap-4">
          <RednderCards />
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;
