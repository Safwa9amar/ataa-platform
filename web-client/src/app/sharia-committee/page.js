"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ShariahCommitteeOpinions() {
  return (
    <section className="container mx-auto p-6" dir="rtl">
      {/* Page Title */}
      <motion.h1
        className="text-3xl font-bold text-teal-600 mb-4 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        اللجنة الشرعية في منصة عطاء
      </motion.h1>

      {/* Sheikh Information */}
      <div className="flex justify-center items-center gap-6 mb-6">
        <motion.div
          className="w-32 h-32 rounded-full overflow-hidden shadow-lg"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="https://img.freepik.com/premium-photo/muslim-sheikh-ramadan-mosque_1132525-66.jpg" // ضع مسار صورة الشيخ هنا
            alt="صورة الشيخ"
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        </motion.div>

        <div className="flex flex-col justify-center">
          <motion.h2
            className="text-xl font-semibold text-teal-600 mb-2"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            الشيخ محمد بن عبد الله
          </motion.h2>
          <motion.p
            className="text-sm text-gray-600"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            هو شيخ معتمد في الفقه الإسلامي وعضو في اللجنة الشرعية لمنصة عطاء.
            يمتلك سنوات طويلة من الخبرة في الفقه والشريعة، وله عدة مؤلفات
            ودراسات علمية. يتمتع بسمعة طيبة في المجتمع الإسلامي ويُعتبر مرجعًا
            مهمًا في المسائل الشرعية المتعلقة بالعمل الخيري.
          </motion.p>
        </div>
      </div>

      {/* Shariah Opinion */}
      <motion.div
        className="bg-teal-100 p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.h3
          className="text-lg font-semibold text-teal-600 mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          رأي اللجنة الشرعية
        </motion.h3>
        <motion.p
          className="text-base text-gray-700"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          بعد دراسة شاملة وافية لمنصة عطاء، تبين للجنة الشرعية أن المنصة تتبع
          المعايير الشرعية في جمع التبرعات وتوزيعها، وأنها توفر وسيلة آمنة
          وموثوقة للتبرع في مجالات متعددة، مما يعزز عمل الخير ويسهم في تحقيق
          الأهداف التنموية. وقد تم التأكيد على أهمية متابعة المنصة ومراقبة جميع
          العمليات المالية لضمان التزامها الكامل بالشريعة الإسلامية.
        </motion.p>
      </motion.div>
    </section>
  );
}
