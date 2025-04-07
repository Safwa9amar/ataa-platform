import { AdeFilter } from "@/app/donation-opportunities/[search]/filterModals/AdeFilter";
import { GeneraleProjectsFilter } from "@/app/donation-opportunities/[search]/filterModals/GeneraleProjectsFilter";
import { IskanFilter } from "@/app/donation-opportunities/[search]/filterModals/IskanFilter";
import { JusticeFilter } from "@/app/donation-opportunities/[search]/filterModals/JusticeFilter";
import { MosqueCare } from "@/app/donation-opportunities/[search]/filterModals/MosqueCare";
import { OrphansFilter } from "@/app/donation-opportunities/[search]/filterModals/OrphansFilter";
import { SanlgazFilter } from "@/app/donation-opportunities/[search]/filterModals/SanlgazFilter";
import EauSvg from "@/components/vectors/EauSvg";
import JusticeSvg from "@/components/vectors/JusticeSvg";
import ProjectsSvg from "@/components/vectors/ProjectsSvg";
import SonalgazSvg from "@/components/vectors/SonalgazSvg";

const CONSTANTS = {
  RegistrationStatus: {
    CREATED: "CREATED", // الحساب الأولي فقط
    VERIFIED: "VERIFIED", // الحساب تم التحقق منه
    COMPLETED: "COMPLETED", // جميع البيانات مكتملة
  },
  subcategoryMap: {
    Project: [
      {
        type: "select",
        name: "gender",
        label: "الجنس",
        data: [
          { value: "male", name: "ذكر" },
          { value: "female", name: "انثى" },
          { value: "mixed", name: "مجموعة (ذكور واناث)" },
        ],
      },
      {
        type: "select",
        name: "maritalStatus",
        label: "الحالة الاجتماعية",
        data: [
          { value: "single", name: "أعزب" },
          { value: "married", name: "متزوج" },
        ],
      },
      {
        type: "text",
        name: "age",
        label: "العمر",
      },
      {
        type: "number",
        name: "numberOfChildren",
        label: "عدد الابناء",
      },
      {
        type: "select",
        name: "specialNeeds",
        label: "مخصص لذوي الاعاقة",
        data: [
          { value: true, name: "نعم" },
          { value: false, name: "لا" },
        ],
      },
    ],
    iskan: [
      {
        type: "select",
        name: "gender",
        label: "الجنس",
        data: [
          { value: "male", name: "ذكر" },
          { value: "female", name: "انثى" },
          { value: "مجموعة (ذكور واناث)", name: "مجموعة (ذكور واناث)" },
        ],
      },
      {
        type: "select",
        name: "maritalStatus",
        label: "الحالة الاجتماعية",
        data: [
          { value: "single", name: "أعزب" },
          { value: "married", name: "متزوج" },
        ],
      },

      {
        type: "text",
        name: "age",
        label: "العمر",
      },
      {
        type: "number",
        name: "numberOfChildren",
        label: "عدد الابناء",
      },
    ],
    kafalat: [
      {
        type: "select",
        name: "gender",
        label: "الجنس",
        data: [
          { value: "male", name: "ذكر" },
          { value: "female", name: "انثى" },
          { value: "مجموعة (ذكور واناث)", name: "مجموعة (ذكور واناث)" },
        ],
      },
      {
        type: "number",
        name: "age",
        label: "العمر",
      },

      {
        type: "select",
        name: "schoolLevel",
        label: "المرحلة الدراسية",
        data: [
          {
            value: "no-school",
            name: "لم يدرس",
          },
          {
            value: "primary-school",
            name: "المرحلة الابتدائية",
          },
          {
            value: "middle-school",
            name: "المرحلة المتوسطة",
          },
          {
            value: "high-school",
            name: "المرحلة الثانوية",
          },
          {
            value: "university",
            name: "الجامعة",
          },
        ],
      },
      {
        type: "select",
        name: "healthStatus",
        label: "الحالة الصحية",
        data: [
          { value: "pure", name: "سليم" },
          { value: "chronic-disease", name: "مرض مزمن" },
          { value: "acute-chronic-disease", name: "مرض مزمن حاد" },
          { value: "special-needs", name: "ذوي احتياجات خاصة" },
        ],
      },
    ],
    masajed: [
      {
        type: "select",
        label: "العناية المطلوبة",
        name: "requiredCare",
        data: [
          { value: "restoration", name: "ترميم" },
          { value: "care", name: "عناية" },
          { value: "maintenance", name: "صيانة" },
        ],
      },
      {
        type: "select",
        label: "درجة التضرر",
        name: "damageDegree",
        data: [
          { value: "prayer-performed", name: "تفام فيه الصلاة" },
          { value: "prayer-not-performed", name: "لا تقام فيه الصلاة" },
        ],
      },
    ],
    justice: [
      {
        type: "select",
        name: "gender",
        label: "الجنس",
        data: [
          { value: "male", name: "ذكر" },
          { value: "female", name: "انثى" },
          { value: "مجموعة (ذكور واناث)", name: "مجموعة (ذكور واناث)" },
        ],
      },
      {
        type: "select",
        name: "maritalStatus",
        label: "الحالة الاجتماعية",
        data: [
          { value: "single", name: "أعزب" },
          { value: "married", name: "متزوج" },
        ],
      },

      {
        type: "number",
        name: "age",
        label: "العمر",
      },
      {
        type: "number",
        name: "casesNum",
        label: "عدد القضايا",
      },
      {
        type: "month",
        name: "duration",
        label: "المدة منذ صدور الفاتورة (شهر)",
      },
    ],
    DisasterRelief: [
      {
        type: "text",
        name: "prisonRegion",
        label: "منطقة السجن",
      },
      {
        type: "textarea",
        name: "caseDetails",
        label: "تفاصيل القضية",
      },
      {
        type: "number",
        name: "legalFees",
        label: "الرسوم القانونية (بالدينار)",
      },
    ],

    sonalgaz: [
      {
        type: "select",
        name: "gender",
        label: "الجنس",
        data: [
          { value: "male", name: "ذكر" },
          { value: "female", name: "انثى" },
          { value: "مجموعة (ذكور واناث)", name: "مجموعة (ذكور واناث)" },
        ],
      },
      {
        type: "select",
        name: "maritalStatus",
        label: "الحالة الاجتماعية",
        data: [
          { value: "single", name: "أعزب" },
          { value: "married", name: "متزوج" },
        ],
      },
      {
        type: "select",
        name: "status",
        label: "الحالة",
        data: [
          { value: "interrupted", name: "منقطعة" },
          { value: "will-interrupted", name: "ستنقطع" },
        ],
      },
    ],
    ade: [
      {
        type: "select",
        name: "gender",
        label: "الجنس",
        data: [
          { value: "male", name: "ذكر" },
          { value: "female", name: "انثى" },
          { value: "مجموعة (ذكور واناث)", name: "مجموعة (ذكور واناث)" },
        ],
      },
      {
        type: "select",
        name: "maritalStatus",
        label: "الحالة الاجتماعية",
        data: [
          { value: "single", name: "أعزب" },
          { value: "married", name: "متزوج" },
        ],
      },
      {
        type: "select",
        name: "status",
        label: "الحالة",
        data: [
          { value: "interrupted", name: "منقطعة" },
          { value: "will-interrupted", name: "ستنقطع" },
        ],
      },
    ],
    // Other category types that do not have a specific subcategory can simply remain unmapped.
    Education: null,
    Health: null,
    Emergencies: null,
    Community: null,
    Environment: null,
    Agriculture: null,
    Water: null,
    FoodRelief: null,
    Scholarships: null,
    Employment: null,
    WomenEmpowerment: null,
    DisabledSupport: null,
    AnimalWelfare: null,
    Technology: null,
    ArtsAndCulture: null,
    Sports: null,
    ElderlyCare: null,
    RuralDevelopment: null,
  },
  DONATION_SCOOP: [
    {
      value: "EDUCATIONAL",
      name: "تعليمي",
    },
    {
      value: "SOCIAL",
      name: "إجتماعي",
    },
    {
      value: "HEALTH",
      name: "صحي",
    },
    {
      value: "NUTRITION",
      name: "غذائي",
    },
    {
      value: "HOUSING",
      name: "الإسكان",
    },
    {
      value: "RELIGIOUS",
      name: "ديني",
    },
    {
      value: "OTHER",
      name: "اخر",
    },
  ],
  DONATION_TYPES: {
    CART: "cart",
    STORE: "store",
    CAMPAIGN: "campaign",
    DONATION_OPPOERTUNITY: "donationOpportunity",
    ZAKAT: "zakat",
    ORPHAN: "orphan",
  },
  USERS_ROLES: {
    visitor: "",
    charity: "charity",
    donor: "donor",
    partner: "partner",
    blood_agency: "blood_agency",
  },
  CAMPAIGNSTATUS: {
    ONGOING: "صدقة جارية",
    URGENT: "مستعجلة",
    NOT_URGENT: "غير مستعجلة",
  },
  CAMPAIGN_USER_CREATETOR_TYPES: {
    USERCAMPAIGN: "USERCAMPAIGN",
    NATIONALCAMPAIGN: "NATIONALCAMPAIGN",
  },
  PAYMENT_METHODS: {
    baridiMob: "baridiMob",
    ccp: "ccp",
    stripe: "stripe",
    chargeLi: "chargily",
    CIB: "CIB",
  },
  OTHER: {
    // enum
    Strategic: "استراتيجي",
    Marketing: "تسويقي",
    Supervisory: "اشرافي",
    Sponsor: "راعي",
    DonationSolutions: "حلول تبرع",
    Government: "حكومي",
    Private: "خاص",
  },
  // Campaign Types
  BLOOD_TYPES: {
    A_POSITIVE: "A+",
    A_NEGATIVE: "A+",
    B_POSITIVE: "B+",
    B_NEGATIVE: "B-",
    O_POSITIVE: "O+",
    O_NEGATIVE: "O-",
    AB_POSITIVE: "AB+",
    AB_NEGATIVE: "AB-",
  },
  BLOOD_TYPES_WITH_NAME: [
    {
      label: "A+",
      value: "A_POSITIVE",
    },

    {
      label: "A-",
      value: "A_NEGATIVE",
    },
    {
      label: "B+",
      value: "B_POSITIVE",
    },
    {
      label: "B-",
      value: "B_NEGATIVE",
    },
    {
      label: "O+",
      value: "O_POSITIVE",
    },
    {
      label: "O-",
      value: "O_NEGATIVE",
    },
    {
      label: "AB+",
      value: "AB_POSITIVE",
    },
    {
      label: "AB-",
      value: "AB_NEGATIVE",
    },
  ],

  DONATION_TAB_DATA: [
    {
      label: "الكل",
      name: "all",
      data: null,
    },
    {
      label: "مشاريع",
      name: "Projects",
      description:
        "ساهم في دعم المشاريع العامة التي تشمل تحسين البنية التحتية، توفير الإسكان، ورعاية الأيتام. تساعد هذه المشاريع في تحسين حياة الأفراد والمجتمعات الأكثر احتياجاً من خلال تبرعاتك الكريمة.",
      icon: <ProjectsSvg />,

      data: [
        { label: "الكل", name: "all", withFilter: false },
        {
          label: "مشاريع عامة",
          name: "Project",
          withFilter: true,
          filter: GeneraleProjectsFilter,
        },
        {
          label: "اسكان",
          name: "iskan",
          withFilter: true,
          filter: IskanFilter,
        },
        {
          label: "كفالة ايتام",
          name: "kafalat",
          withFilter: true,
          filter: OrphansFilter,
        },
        {
          label: "العناية بالمساجد",
          name: "masajed",
          withFilter: true,
          filter: MosqueCare,
        },
      ],
    },
    {
      label: "تيسرت",
      name: "Tayasart",
      description:
        "مبادرة تهدف إلى تخفيف الأعباء المالية عن الأسر المحتاجة عبر تغطية فواتير الكهرباء، الماء، والغاز، ودعم الإعانات القضائية. ساهم في تحقيق استقرار أكبر للأسر المحتاجة من خلال التبرع.",
      data: [
        { label: "الكل", name: "all", withFilter: false },
        {
          label: "فواتير الكهرباء و الغاز",
          name: "sonalgaz",
          icon: <SonalgazSvg />,
          withFilter: true,
          filter: SanlgazFilter,
        },
        {
          label: "فواتير المياه",
          name: "ade",
          icon: <EauSvg />,
          withFilter: true,
          filter: AdeFilter,
        },
        {
          label: "التنفيذ القضائي",
          name: "justice",
          icon: <JusticeSvg />,
          filter: JusticeFilter,

          withFilter: true,
        },
      ],
    },
    {
      label: "فرجت",
      name: "Forejat",
      description:
        "تتيح مبادرة فرجت للمساهمين فرصة تسديد ديون السجناء ودعمهم للعودة إلى حياتهم الطبيعية مع أسرهم. ساهم في منح الأمل وتخفيف المعاناة.",
      data: null,
    },
    {
      label: "إغاثة",
      name: "Eghatha",
      description:
        "ساعد في توفير الدعم الطارئ للأسر المتضررة من الكوارث الطبيعية والأزمات. تشمل المساعدات الغذائية والطبية والخدمات الأساسية، مما يعزز التكافل الاجتماعي.",
      data: null,
    },
    {
      label: "متجر التبرع",
      name: "donationStore",
      description: "",
      data: null,
    },
  ],
};
export default CONSTANTS;
