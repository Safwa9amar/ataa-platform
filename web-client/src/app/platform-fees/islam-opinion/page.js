"use client";
import HoverCard from "@/components/UI/HoverCard";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

export default function IslamicOpinion() {
  return (
    <div className="container max-w-4xl mx-auto p-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h4" className="text-blue-800 font-bold mb-4">
          رأي الإسلام
        </Typography>

        <Typography variant="h5" className="text-blue-700 font-semibold mb-2">
          أ. مقدمة عامة
        </Typography>
        <Typography className="text-gray-700 text-justify mb-4">
          ترى منصة عطاء أن إدارة التبرعات تُعد من أعظم الأعمال الخيرية، إذ يعمل
          جامع التبرعات كوكيل مؤتمن على أموال المتبرعين. تلتزم المنصة بتطبيق أسس
          الشريعة الإسلامية في الكتاب والسنة، مستندة إلى اجتهادات العلماء مثل
          الشيخ ابن باز، والشيخ ابن عثيمين، والشيخ الألباني، الذين أكدوا ضرورة
          الالتزام بالشفافية والإفصاح في عملية جمع التبرعات.
        </Typography>
        <Typography className="text-gray-700 text-justify mb-4">
          يُعتبر المتبرع بمثابة الواقف الذي يحدد وجهة أمواله؛ فإذا وافق على نظام
          الرسوم وكان على دراية كاملة بآلية احتسابها، يكون ذلك جائزًا شرعاً
          مقابل الجهود المبذولة في جمع وتوزيع التبرعات.
        </Typography>

        <Typography variant="h5" className="text-blue-700 font-semibold mb-2">
          ب. الشروط والضوابط الأساسية
        </Typography>
        <div className="grid justify-items-center md:grid-cols-2 my-5">
          <HoverCard
            variant="h5"
            desciption="يجب أن يُعلن نظام الرسوم بوضوح في الصفحة، بحيث يدرك كل متبرع أن المبلغ الذي يدفعه يشمل رسمًا إضافيًا مقابل جهود الجمع."
            title={"الشفافية المطلقة"}
          />
          <HoverCard
            variant="h5"
            desciption={
              "يجب أن تكون النسبة المقررة مقابل الجهود متناسبة مع العمل المبذول دون زيادة مبالغ فيها."
            }
            title={"حدود الرسوم المعقولة"}
          />
          <HoverCard
            variant="h5"
            desciption={
              "تُقتطع الرسوم فقط من التبرعات التطوعية، في حين تُصرف أموال الزكاة للمستحقين دون أي اقتطاع."
            }
            title={"الفصل بين الزكاة والصدقات"}
          />
          <HoverCard
            variant="h5"
            desciption={
              "يكون أخذ الرسوم بموافقة المتبرعين وبناءً على اتفاق شفاف يُوضح جميع الشروط منذ البداية."
            }
            title={"الاتفاق المسبق"}
          />
        </div>
        <Typography variant="h4" className="text-blue-800 font-bold mb-4">
          خاتمة واستنتاج
        </Typography>
        <Typography className="text-gray-700 text-justify mb-4">
          تجمع منصة عطاء بين الالتزام الشرعي والابتكار التقني في إدارة التبرعات،
          إذ نعمل وفقًا لضوابط الشريعة الإسلامية كما جاءت في القرآن والسنة
          واستنادًا إلى اجتهادات العلماء؛ حيث أكدوا على جواز أخذ أجر مقابل جهود
          جمع التبرعات التطوعية بشرط الإفصاح الصريح وموافقة المتبرعين.
        </Typography>
        <Typography className="text-gray-700 text-justify mb-4">
          ومن هنا نؤكد للمستخدمين أن نظام رسوم المنصة مصمم لضمان شفافية كاملة
          واستدامة العمل الخيري، مع احترام المقاصد الشرعية، مع تقديم خدمة حساب
          وإخراج الزكاة مجاناً لضمان وصولها للمستحقين دون أي معوقات.
        </Typography>
        <Typography className="text-gray-700 text-justify">
          نحن في عطاء نعمل بكل جدية واحترافية لضمان أن تظل خدماتنا مطابقة لأعلى
          المعايير الشرعية والأخلاقية، في تحقيق هدفنا الأسمى في خدمة الخير
          والمستحقين.
        </Typography>
      </motion.div>
      <br />

      <Link className="flex gap-2" href={"#"}>
        الاطلاع على فتوى دار الافتاء الجزائرية
        <FiExternalLink />
      </Link>
      <br />

      <Link className="flex gap-2" href={"/sharia-committee"}>
        الاطلاع على فيديوات الفتاوى لـاللجنة الشرعية لمنصة عطاء
        <FiExternalLink />
      </Link>
    </div>
  );
}
