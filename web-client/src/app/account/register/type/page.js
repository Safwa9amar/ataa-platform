"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { FaUser, FaStore, FaHandHoldingHeart, FaTint } from "react-icons/fa";
import withRegistrationStatus from "@/components/hoc/withRegistrationStatus";
import { useCredentials } from "@/context/CredentialsContext";
import { toast } from "react-toastify";
import { updateUser } from "@/services/userServices";

function AccountTypeSelection() {
  const router = useRouter();
  const { isLoggedIn, user, checkAuthentication, userToken, loading } =
    useCredentials();


  const handleAccountTypeSelection = async (accountType) => {
    if (isLoggedIn && user.id && accountType === "user") {
      try {
        await updateUser(
          user.id,
          {
            registrationStatus: "COMPLETED",
            role: "donor",
          },
          userToken
        );
        checkAuthentication(userToken);
      } catch (error) {
        toast.error("حدث خطأ ما يرجى اعادة تحميل الصفحة");
      }
      return router.replace(`/account/profile/${user?.role ? user?.role : ""}`);
    }
    router.push(`/account/register/type/${accountType}`);
  };

  const accountTypes = [
    {
      type: "user",
      title: "حساب فردي (للمتبرعين)",
      description:
        "إذا كنت شخصًا يرغب في دعم المحتاجين والمشاركة في التبرعات، فهذا الخيار هو الأنسب لك!",
      icon: <FaUser className="text-blue-500 text-4xl" />,
    },
    {
      type: "charity",
      title: "حساب جمعية خيرية",
      description:
        "هذا الحساب مصمم خصيصًا للجمعيات الخيرية لتنظيم فرص التبرع واستلام الدعم.",
      icon: <FaHandHoldingHeart className="text-green-500 text-4xl" />,
    },
    {
      type: "partner",
      title: "حساب شركاء متجر عطاء",
      description:
        "هل تملك متجرًا أو شركة وترغب في المساهمة بعروضك وخدماتك؟ هذا الحساب هو الخيار المثالي!",
      icon: <FaStore className="text-amber-500 text-4xl" />,
    },
    {
      type: "blood_agency",
      title: "حساب الوكالة الوطنية للتبرع بالدم",
      description:
        "هذا النوع من الحسابات مخصص للوكالات الوطنية للتبرع بالدم لتنظيم الحملات وجذب المتبرعين.",
      icon: <FaTint className="text-red-500 text-4xl" />,
    },
  ];

  return (
    <motion.div
      className="md:min-h-[70vh] flex flex-col justify-center items-center bg-gray-100 dark:bg-transparent p-4"
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* شعار مع رسوم متحركة */}
      <motion.div
        className="m-2"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <img
          src="/logo/fullLogo.png"
          alt="Logo"
          className="w-64 h-40 object-contain"
        />
      </motion.div>

      {/* العنوان الرئيسي */}
      <motion.h1
        className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        اختر نوع الحساب الذي يناسبك
      </motion.h1>

      {/* الوصف الإضافي بعد العنوان */}
      <motion.p
        className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        نحن هنا لمساعدتك في اختيار الحساب المثالي! سواء كنت فردًا، جمعية خيرية،
        شريكًا تجاريًا، أو وكالة للتبرع بالدم، نحن نوفر لك الأدوات التي تحتاجها
        لتحقيق أهدافك بسهولة.
      </motion.p>

      {/* البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {accountTypes.map((account, index) => (
          <motion.div
            key={account.type}
            className="cursor-pointer"
            onClick={() => handleAccountTypeSelection(account.type)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, delay: index * 0.5 }}
          >
            <Card className="p-6 shadow-lg rounded-lg hover:shadow-2xl transition-all duration-300 bg-mangoBlack border border-borderColor">
              <div className="flex items-center gap-4">
                {account.icon}
                <div>
                  <Typography
                    variant="h6"
                    className="font-bold text-gray-800 dark:text-gray-400"
                  >
                    {account.title}
                  </Typography>
                  <Typography
                    variant="small"
                    className="text-gray-600 dark:text-gray-400 mt-2"
                  >
                    {account.description}
                  </Typography>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default withRegistrationStatus(AccountTypeSelection);
