import React from "react";
import { motion } from "framer-motion";
import DividerWithText from "@/components/UI/DividerWithText";

export default function Vision() {
  return (
    <section>
      {/* Vision Section */}
      <DividerWithText>
        <motion.h2
          className="text-3xl drop-shadow-lg font-semibold mb-3 text-teal-600 text-center"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          رؤية عطاء ورسالتها
        </motion.h2>
      </DividerWithText>

      {/* First Card: Vision */}
      <motion.div
        className="mb-14 flex items-stretch bg-teal-500 dark:bg-teal-800 rounded-md overflow-hidden"
        initial={{ opacity: 0, x: -500 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <p className="p-10 text-xl text-white flex justify-center items-center">
          رؤية عطاء
          <br />
          نسعى في منصة عطاء إلى تعزيز التحول الرقمي للقطاع الخيري والتنموي، من
          خلال تقديم حلول مبتكرة تسهم في تمكين الجمعيات والمؤسسات والأفراد من
          المشاركة المجتمعية الفعّالة. نهدف إلى تعظيم الأثر الإيجابي للمبادرات
          الخيرية والتنموية وصناعة التغيير المستدام، بما يعزز قيم العطاء،
          المسؤولية الاجتماعية، والانتماء الوطني، مع التركيز على تحقيق الشفافية
          والموثوقية في جميع الممارسات.
        </p>
        <img
          src="/images/Cover-4.png"
          className="w-96 h-64 object-cover rounded-md"
          alt="رؤية عطاء"
        />
      </motion.div>

      {/* Second Card: Mission */}
      <motion.div
        className="mb-14 flex items-stretch bg-teal-500 dark:bg-teal-800 rounded-md overflow-hidden"
        initial={{ opacity: 0, x: 500 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <img
          src="/images/10329124_812376898786189_2494069963980578988_n1-600x400.jpg"
          className="w-96 h-64 object-cover rounded-md"
          alt="رسالة عطاء"
        />
        <p className="p-10 text-xl text-white flex justify-center items-center">
          رسالة عطاء
          <br />
          تمكين قطاع العمل الخيري والتنموي الاجتماعي في الجزائر من خلال
          الاستفادة من البيانات والمعلومات لتفعيل الربط الرقمي بين المتبرعين
          والجماعات الخيرية والتسويق للعمل الخيري وتقديم الإرشادات لكل الطرفين.
        </p>
      </motion.div>
    </section>
  );
}
