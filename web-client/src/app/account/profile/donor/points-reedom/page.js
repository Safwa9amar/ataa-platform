"use client";

import { useCredentials } from "@/context/CredentialsContext";
import { useState } from "react";
import axios from "axios";
import { Button, Typography, Alert } from "@material-tailwind/react";
import { motion } from "framer-motion";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { getCommonHeaders } from "@/services/getCommonHeaders";

export default function ConvertPointsPage() {
  const { user, userToken, checkAuthentication } = useCredentials();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleConvertPoints = async () => {
    if (!user?.id) {
      setMessage("يجب تسجيل الدخول أولاً");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        API_ENDPOINTS.CONVERT_AMBASADOR_POINTS,
        {},
        {
          headers: getCommonHeaders(userToken),
        }
      );
      setMessage(response.data.message);
      checkAuthentication(userToken);
    } catch (error) {
      console.log(error);
      setMessage("حدث خطأ أثناء تحويل النقاط");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      dir="rtl"
      className="container  p-4 "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src="/images/charityday.jpg"
        alt="Placeholder"
        className="w-full h-60 object-cover rounded mb-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      <Typography variant="h4" className="mb-2">
        تحويل نقاط سفراء العطاء
      </Typography>
      <Typography variant="paragraph" className="mb-4">
        مرحبًا، {user?.name}
      </Typography>

      <Typography
        variant="paragraph"
        className="text-gray-700 dark:text-gray-300"
      >
        يمكنك تحويل نقاط سفراء العطاء الخاصة بك إلى رصيد مالي يمكن استخدامه داخل
        المنصة. يتم احتساب النقاط المتاحة وتحويلها تلقائيًا بناءً على معدل
        التحويل المحدد. هذه العملية تتيح لك الاستفادة القصوى من جهودك في نشر
        الخير ودعم المبادرات الخيرية.
      </Typography>

      <Typography
        variant="paragraph"
        className="text-gray-700 dark:text-gray-300 mt-2"
      >
        كل نقطة تقوم بجمعها من خلال مشاركة الروابط أو التبرعات تزيد من رصيدك،
        مما يمنحك القدرة على دعم المشاريع الخيرية بسهولة. استمر في نشر الخير
        واستفد من مكافآتك!
      </Typography>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          color="blue"
          onClick={handleConvertPoints}
          disabled={loading}
          className="mt-4 w-full"
        >
          {loading ? "جاري التحويل..." : "تحويل النقاط"}
        </Button>
      </motion.div>

      {message && <Alert className="mt-4">{message}</Alert>}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 p-4 bg-nav_bg shadow-md rounded-lg"
      >
        <Typography variant="h5" className="mb-2">
          كيف تعمل هذه الخاصية؟
        </Typography>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>عند مشاركة الروابط، تكسب نقاط سفراء العطاء.</li>
          <li>يمكنك تحويل هذه النقاط إلى رصيد مالي في أي وقت.</li>
          <li>النقاط يتم تحويلها بناءً على معدل التحويل المحدد.</li>
          <li>بعد التحويل، سيتم تصفير نقاطك المحولة وإضافتها إلى رصيدك.</li>
          <li>
            يمكنك استخدام رصيدك لدعم المشاريع أو التبرع مباشرة عبر المنصة.
          </li>
          <li>
            كلما زاد عدد النقاط لديك، زادت فرصتك في التأثير الإيجابي على
            المجتمع.
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
