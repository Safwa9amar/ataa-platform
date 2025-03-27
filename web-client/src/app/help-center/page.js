"use client";
import { motion } from "framer-motion";

export default function HelpCenter() {
  return (
    <section className="container mx-auto p-6" dir="rtl">
      {/* Introduction Section */}
      <motion.h1
        className="text-3xl font-bold text-teal-600 mb-4 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        مركز المساعدة
      </motion.h1>

      <motion.p
        className="text-base text-gray-700 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        سعياً من منصة <strong>"عطاء"</strong> لتحقيق رضا العملاء، وحرصاً على
        تمكين العميل من الاستفادة الكاملة من الخدمات التي تقدمها المنصة
        والارتقاء بجودة الخدمات في جميع الأوقات، وتقديم الدعم اللازم في أسرع وقت
        ممكن، نقدم لكم اتفاقية مركز المساعدة والمعايير المتعلقة بالخدمات
        المقدمة، حيث تتم المراجعة الدورية لأداء الخدمات المقدمة وتحسينها بشكل
        مستمر.
      </motion.p>

      {/* Technical Support Section */}
      <motion.h2
        className="text-2xl font-semibold text-teal-600 mb-3"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        المساعدة والدعم الفني
      </motion.h2>
      <motion.p
        className="text-base text-gray-700 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        يتم تقديم الدعم الفني عن طريق استقبال البلاغات من الساعة 8:00 صباحاً حتى
        11:59 مساءً. خلال شهر رمضان، سيتم تقديم الدعم الفني على مدار 24 ساعة عبر
        قنوات التواصل المتاحة.
      </motion.p>

      {/* Notes and Complaints Section */}
      <motion.h2
        className="text-2xl font-semibold text-teal-600 mb-3"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        الملاحظات والشكاوى
      </motion.h2>
      <motion.p
        className="text-base text-gray-700 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        نسعد باستقبال ملاحظاتكم التي تسهم في تحسين تقديم الخدمة واستقبال الشكاوى
        في حال عدم الرضا عن الخدمة المقدمة لكم عبر القنوات المتاحة للعميل.
        <br />
        يمكنكم الإتصال مباشرة بمركز الشكوى عبر الرقم 058845120، ويتم الرد على
        الاستفسارات أو الشكاوى من خلال موظف خدمة العملاء أو يمكنكم مراسلة المركز
        إما عبر البريد الإلكتروني أو خاصية الدردشة. في هذه الحالة تتم خدمة
        العميل في مدة أقصاها 120 دقيقة، كما نسعى دائماً لتحسين مدة الاستجابة.
      </motion.p>

      {/* Complaints Follow-up */}
      <motion.h2
        className="text-2xl font-semibold text-teal-600 mb-3"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        في حال لم تتم خدمتكم بشكل فوري
      </motion.h2>
      <motion.p
        className="text-base text-gray-700 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        يتم تسجيل الشكوى في النظام مع توضيح البيانات الشخصية للعميل. تصل إلى
        العميل رسالة نصية برقم الشكوى. يمكنكم الاستفسار في أي وقت عن حالة الشكوى
        عبر الاتصال بالرقم 058845120. المدة المتوقعة لمعالجة الشكوى هي 10 أيام
        عمل.
      </motion.p>

      {/* Complaint Escalation */}
      <motion.h2
        className="text-2xl font-semibold text-teal-600 mb-3"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        آلية تصعيد الشكوى
      </motion.h2>
      <motion.p
        className="text-base text-gray-700 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        يحق للعميل الذي يرى أن معالجة الشكوى لم تكن منصفة له أن يبلغ مسؤول شكاوى
        العملاء، ويتم عرضها على مستوى إداري أعلى لمراجعتها. في حال عدم رضاكم عن
        حل الشكوى، يمكنكم تصعيد الشكوى عبر الرقم 058845120.
      </motion.p>

      {/* Privacy and Confidentiality */}
      <motion.h2
        className="text-2xl font-semibold text-teal-600 mb-3"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        الخصوصية وسرية المعلومات
      </motion.h2>
      <motion.p
        className="text-base text-gray-700 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        تحرص شركة <strong>"عطاء"</strong> على الحفاظ على خصوصية وسرية معلومات
        المستخدمين، وتطبيق السياسات المتعلقة بخصوصية البيانات وذلك عند طلب
        بيانات العميل الشخصية مثل رقم الهوية، الاسم الثلاثي، رقم الهاتف، وفي
        حالات استرجاع المبالغ يتم طلب آخر 4 أرقام من بطاقة الدفع. لمزيد من
        التفاصيل، يمكنكم الرجوع إلى سياسة الخصوصية الخاصة بالمنصة.
      </motion.p>

      {/* Contact Numbers Card */}
      <motion.div
        className="bg-teal-100 p-6 rounded-lg shadow-lg mb-6"
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
          أرقام التواصل
        </motion.h3>
        <p className="text-base text-gray-700">
          <strong>توفر الخدمة:</strong> 8:00 صباحاً حتى 11:59 مساءً
          <br />
          <strong>مدة الاستجابة:</strong> 60 ثانية
        </p>
      </motion.div>

      {/* Email Contact Card */}
      <motion.div
        className="bg-teal-100 p-6 rounded-lg shadow-lg mb-6"
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
          البريد الإلكتروني
        </motion.h3>
        <p className="text-base text-gray-700">
          <strong>توفر الخدمة:</strong> 24/7
          <br />
          <strong>مدة الاستجابة:</strong> 120 دقيقة
        </p>
      </motion.div>

      {/* Chat Contact Card */}
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
          الدردشة
        </motion.h3>
        <p className="text-base text-gray-700">
          <strong>توفر الخدمة:</strong> 8:00 صباحاً حتى 11:59 مساءً
          <br />
          <strong>مدة الاستجابة:</strong> 60 دقيقة
        </p>
      </motion.div>
    </section>
  );
}
