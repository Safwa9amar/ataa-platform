import React from "react";
import { motion } from "framer-motion";
import { Avatar } from "@material-tailwind/react";
import { FaChartBar } from "react-icons/fa";
import Image from "next/image";
export default function Definition() {
  return (
    <div className="bg-aboutUsBg bg-[100% 100%] bg-center bg-fixed bg-no-repeat w-screen mb-20">
      <section className="grid grid-cols-2 bg-black bg-opacity-70 p-16">
        <div>
          {/* Title with animation */}
          <motion.h1
            className="text-4xl font-bold  mb-6 text-teal-700"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            التعريف بالمؤسسة
          </motion.h1>

          {/* Paragraph with text */}
          <motion.p
            className="mb-6 text-teal-50 text-xl "
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            يمثل التطبيق مبادرة لاستثمار البيانات وتطبيق تقنيات الذكاء الاصطناعي
            بهدف تعظيم تأثير المشاريع والخدمات التنموية وضمان استدامتها. يهدف
            التطبيق أيضًا إلى تقديم حلول تقنية متقدمة وبناء منظومة فعّالة تجمع
            بين الشركات، القطاعات الحكومية، والمؤسسات غير الربحية. الغاية من هذه
            الجهود هي تعزيز دور الجزائر كرائدة في مجال الأعمال التنموية
            والخيرية، وزيادة مساهمة القطاع غير الربحي في الناتج المحلي الإجمالي،
            وتعزيز الانتماء الوطني والمسؤولية الاجتماعية للأفراد والمؤسسات في
            المجتمع.
          </motion.p>
          <div className="flex flex-wrap justify-around items-center gap-6 py-8">
            {/* First Item - وطن مزدهر */}
            <div className="w-40 h-40 flex flex-col items-center justify-center  gap-2 p-4 rounded-full bg-teal-100 shadow-lg transition-all hover:scale-105 hover:bg-teal-100">
              <Avatar src="/flags/dz.png" alt="Flag of Algeria" size="lg" />
              <h3 className="text-sm font-semibold text-center text-teal-800">
                وطن مزدهر
              </h3>
            </div>

            {/* Second Item - مواطنة مسؤول */}
            <div className="w-40 h-40 flex flex-col items-center justify-center gap-2 p-4 rounded-full bg-teal-100 shadow-lg transition-all hover:scale-105 hover:bg-teal-100">
              <Avatar src="/logo/fullLogo.png" alt="Ataa Logo" size="lg" />
              <h3 className="text-sm font-semibold text-center text-teal-800">
                مواطنة مسؤول
              </h3>
            </div>

            {/* Third Item - رفع مساهمة القطاع الغير ربحي */}
            <div className="w-40 h-40 flex flex-col items-center justify-center gap-2 p-4 rounded-full bg-teal-100 shadow-lg transition-all hover:scale-105 hover:bg-teal-100">
              <FaChartBar size={32} className="text-teal-700" />
              <h3 className="text-sm font-semibold text-center text-teal-800">
                رفع مساهمة القطاع الغير ربحي
              </h3>
            </div>
          </div>
        </div>

        {/* Animated Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/logo/fullLogo.png"
            alt="Ataa Logo"
            width={500}
            height={350}
            className="object-cover"
          />
        </motion.div>
      </section>
    </div>
  );
}
