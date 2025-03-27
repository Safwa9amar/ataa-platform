"use client";

import React, { useState } from "react";
import { Typography, Collapse, Button } from "@material-tailwind/react";
import { BiChevronDownCircle } from "react-icons/bi";

export default function BloodDonationRequirements() {
  const [openIndex, setOpenIndex] = useState(null);

  const requirements = [
    {
      question: "ما هي شروط العمر للتبرع بالدم؟",
      answer:
        "يجب أن يكون المتبرع في الفئة العمرية المسموح بها، والتي عادة ما تكون بين 17 و60 عامًا. في بعض الحالات، قد يُسمح بالتبرع للأشخاص الذين تجاوزوا سن الستين، بشرط أن يتمتعوا بصحة جيدة ويُوافق الطبيب المختص.",
    },
    {
      question: "ما هو الحد الأدنى للوزن المطلوب للتبرع؟",
      answer:
        "من الضروري أن يكون وزن المتبرع مناسبًا، حيث يجب ألا يقل عن 50 كيلوغرامًا. هذا لضمان أن الجسم قادر على تحمل فقدان الدم دون تأثيرات صحية سلبية.",
    },
    {
      question: "ما هي المتطلبات الصحية العامة للتبرع بالدم؟",
      answer:
        "ينبغي أن يتمتع المتبرع بحالة صحية جيدة. يجب أن يكون خالياً من الأمراض المعدية مثل الإيدز، الالتهاب الكبدي، والملاريا. يُنصح المتبرع بالراحة الجيدة والنوم الكافي قبل التبرع لضمان صحة وسلامة عملية التبرع.",
    },
    {
      question: "ما هي شروط ضغط الدم للتبرع بالدم؟",
      answer:
        "يجب أن يكون ضغط الدم في النطاق الطبيعي عند التبرع. في حال كان المتبرع يعاني من اضطرابات في ضغط الدم، يجب استشارة الطبيب للتأكد من ملاءمته للتبرع.",
    },
    {
      question: "ما هي مستويات الهيموغلوبين المطلوبة للتبرع؟",
      answer:
        "يجب أن تكون مستويات الهيموغلوبين ضمن النطاق الطبيعي. الهيموغلوبين هو البروتين الذي يحمل الأكسجين في الدم، ويجب أن تكون مستوياته كافية لضمان عدم تعرض المتبرع للدوار أو الإعياء بعد التبرع.",
    },
    // أضف بقية الشروط بنفس التنسيق
  ];

  const toggleCollapse = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section>
      <div
        dir="rtl"
        className="container mx-auto p-4 text-gray-800 dark:text-gray-200"
      >
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-extrabold text-center mb-8 text-teal-700 dark:text-teal-300 font-ElMessiri">
            شروط التبرع بالدم
          </h1>
          {requirements.map((item, index) => (
            <div key={index} className="mb-6 w-full max-w-3xl">
              <Button
                variant="outlined"
                color="teal"
                onClick={() => toggleCollapse(index)}
                className="
                  w-full text-lg text-right flex justify-between items-center font-ElMessiri 
                  p-5 bg-gray-100 dark:bg-teal-700 border rounded-lg shadow-md 
                  hover:bg-teal-200 dark:hover:bg-teal-800 transition-all duration-300
                "
              >
                <span className="text-right dark:text-teal-200">
                  {item.question}
                </span>
                <BiChevronDownCircle
                  size={26}
                  className={`transition-transform duration-300 dark:fill-teal-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </Button>

              <Collapse open={openIndex === index}>
                <Typography className="p-6 text-lg text-gray-700 dark:text-gray-200 font-ElMessiri bg-gray-50 dark:bg-gray-700 border-t-2 border-borderColor rounded-b-lg mt-2">
                  {item.answer}
                </Typography>
              </Collapse>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
