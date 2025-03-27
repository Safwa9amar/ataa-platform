const data = [
  {
    question: "ما هي أهداف منصة عطاء؟",
    answer:
      "تهدف منصة عطاء إلى تمكين القطاع غير الربحي والتنموي، وتعزيز قيم الانتماء الوطني والمسؤولية الاجتماعية لدى أفراد المجتمع ومؤسساته. كما تسعى المنصة إلى تحقيق الموثوقية والشفافية والسهولة في عملية تقديم التبرعات، بالإضافة إلى تكريم المتميزين في العطاء الخيري والتنموي.",
  },
  {
    question: "ما الفائدة من التسجيل في المنصة؟",
    answer:
      "التسجيل بمنصة عطاء يُمكن المستخدم من الاطلاع على بيانات التبرعات السابقة، وتقارير التبرعات بالإضافة إلى عدد من المزايا والخصائص الأخرى.",
  },
  {
    question: "هل يشترط للتسجيل بأن يكون برقم هاتف جزائري؟",
    answer: "منصة عطاء حاليًا تقبل التسجيل برقم هاتف جزائري فقط.",
  },
  {
    question: "وصلتني رسالة أو إتصال يطلب مني تزويدهم بمعلومات شخصية أو خاصة؟",
    answer:
      "نود التأكيد على أن منصة عطاء لا تطلب أي معلومات شخصية أو خاصة، نرجو منكم توخي الحذر وإتخاذ الحيطة اللازمة.",
  },
  {
    question: "هل فرص التبرع المعلنة مقتصرة على داخل الجزائر؟",
    answer:
      "تقدم منصة عطاء فرص تبرع متنوعة داخل الجزائر وخارجها، وفقاً لما يردها من مشاريع وفرص عبر شركائها.",
  },
  {
    question: "أرغب بأن لا تظهر بياناتي الشخصية ويظهر تبرعي كفاعل خير",
    answer:
      "عبر منصة عطاء يمكن التبرع دون معرفة البيانات الشخصية، وذلك من خلال خاصية التبرع السريع أو التبرع المباشر دون تسجيل أو من خلال إلغاء خاصية كبار المحسنين الموجودة في صفحة حسابي.",
  },
  {
    question: "هل أستطيع الاطلاع على تقارير التبرع؟",
    answer:
      "التقارير الخاصة بعملية التبرع يتم نشرها عبر المنصة بعد اكتمال فرصة التبرع.",
  },
  {
    question: "كيف أطلع على تبرعاتي السابقة؟",
    answer:
      "بعد تسجيل الدخول للمنصة والانتقال إلى صفحة حسابي، يمكنك إستعراض سجل التبرعات أو سجل الرصيد.",
  },
  {
    question: "ما هو التبرع السريع ؟",
    answer:
      "التبرع السريع هو تبرع مباشر يتم خلال ثواني، دون الحاجة إلى التسجيل في منصة عطاء أو تعبئة أي بيانات إضافية حيث يذهب تبرعك مباشرة إلى الحالات الأشد إحتياج على المنصة.",
  },
  {
    question: "ماهي فرص التبرع ؟",
    answer:
      "فرص التبرع هي المشاريع المدرجة في منصة عطاء والتي يمكن المساهمة بالتبرع لصالحها.",
  },
  {
    question: "هل أستطيع دفع زكاتي عبر المنصة؟",
    answer:
      "نعم يمكنك دفع زكاتك عبر خدمة حاسبة الزكاة والموجودة ضمن صفحة برامجنا في المنصة.",
  },
  {
    question: "هل أستطيع التبرع بمواد عينية؟",
    answer:
      "نعم توفر المنصة فرص بحاجة إلى مواد عينية ويمكن للمتبرع بشرائها من خلال متجر عطاء.",
  },
  {
    question: "هل يوجد حد أدنى أو أعلى للتبرع؟",
    answer: "عبر منصة عطاء لا يوجد حد أدنى ولا حد أعلى للتبرع.",
  },
  {
    question: "ما هي سفراء عطاء؟",
    answer:
      "هي خدمة تتيح مشاركة فرص التبرع عبر وسائل التواصل المختلفة، مما يساهم في نشر الخير ومضاعفة الأجر، كما يتم حساب النقاط بعد كل عملية تبرع وإضافتها في الصفحة الشخصية للمساهم في عملية النشر لتمكنه من دخول تصنيف السفراء.",
  },
  {
    question: "ما فائدة من نقاط سفراء عطاء؟",
    answer: "بإمكانك الاستفادة من النقاط من خلال التبرع بها عبر المنصة.",
  },
  {
    question: "ماهي وسائل الدفع المتاحة ؟",
    answer:
      "نوات الدفع المتاحة حاليًا عبر منصة عطاء هي: البطاقة الذهبية (بريد الجزائر), BARIDI الدفع عبرMOB, البطاقات البنكية الخارجية مثل WISE و REDOTPAY. ونعمل على توسيع قنوات الدفع خلال الأيام القادمة.",
  },
  {
    question: "هل أستطيع التبرع نقدًا؟",
    answer:
      "منصة عطاء تقبل التبرعات عبر وسائل الدفع الإلكترونية فقط، والتي تتم عبر المنصة الرسمية، ولا تستقبل التبرعات النقدية إطلاقًا.",
  },
  {
    question: "هل هناك رسوم بنكية أو تشغيلية على التبرعات؟",
    answer:
      "نعم، توجد رسوم رمزية على التبرعات لدعم المنصة تجدون النسبة التفصيلية على موقع عطاء الرسمي.",
  },
  {
    question:
      "نحن جهة رسمية ومصرح لها بجمع التبرعات ونرغب بعرض فرص التبرع عبر المنصة. كيف يمكننا التواصل؟",
    answer: `نسعد بتواصلكم عبر البريد الإلكتروني ${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}.`,
  },
  {
    question: "هل تتعامل المنصة مع الأفراد المحتاجين بشكل مباشر؟",
    answer:
      "تعمل منصة عطاء على تمكين الجهات الخيرية وتنمية مواردها، ولا تتعامل مع الأفراد بشكل مباشر.",
  },
  {
    question: "أواجه مشكلة في تصفح المنصة، ماذا أفعل؟",
    answer:
      "خدمة متبرعي عطاء تعمل على راحتكم، يمكنكم التواصل معهم من خلال وسائل التواصل المتوفرة في صفحة حسابي.",
  },
];

export default data;
