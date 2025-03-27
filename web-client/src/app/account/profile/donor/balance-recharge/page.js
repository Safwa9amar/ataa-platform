"use client";
import React, { useEffect, useState } from "react";
import {
  Typography,
  Input,
  Button,
  Card,
  Spinner,
  CardBody,
} from "@material-tailwind/react";
import { FaCoins, FaCreditCard, FaShieldAlt } from "react-icons/fa";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { useCredentials } from "@/context/CredentialsContext";
import { createRecharge } from "@/services/rechargeService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaymentMethodsTabs from "@/components/UI/PaymentMathodesTabs";

export default function ChargeBalance() {
  const { user, userToken, checkAuthentication } = useCredentials();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    activeAmount: 0,
    activeTab: "",
    customAmount: "",
  });

  const handleAmountPress = (amount) => {
    setState((prev) => ({
      ...prev,
      activeAmount: amount,
      customAmount: String(amount),
    }));
  };

  const handleTabChange = (tab) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setState((prev) => ({
      ...prev,
      customAmount: value,
      activeAmount: parseFloat(value) || 0,
    }));
  };

  const handleRecharge = async () => {
    if (state.activeAmount < 100) {
      toast.error(
        state.activeAmount === 0
          ? "الرجاء اختيار مبلغ"
          : "الحد الأدنى للشحن هو 100 دج",
        { position: "bottom-left" }
      );
      return;
    }
    if (!state.activeTab) {
      toast.error("الرجاء اختيار طريقة الدفع", { position: "bottom-left" });
      return;
    }

    try {
      setLoading(true);
      const res = await createRecharge(
        {
          amount: state.activeAmount,
          points: state.activeAmount,
          userId: user.id,
        },
        userToken
      );
      if (res) {
        await checkAuthentication(userToken);
        toast.success("تمت العملية بنجاح! سيتم تفعيل الرصيد خلال 24 ساعة", {
          position: "bottom-left",
          icon: <RiMoneyDollarCircleFill className="text-green-500" />,
        });
        setState({ activeAmount: 0, activeTab: "", customAmount: "" });
      }
    } catch (error) {
      console.error(error.message);
      toast.error("فشل عملية الشحن، الرجاء المحاولة لاحقًا", {
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      dir="rtl"
      className="w-full bg-transparent  shadow-xl rounded-2xl text-right"
    >
      <CardBody className="p-6 md:p-8">
        <div className=" mb-8">
          <div className="inline-block p-4 bg-teal-100 rounded-full mb-4">
            <FaCoins className="text-4xl text-teal-600" />
          </div>
          <Typography variant="h2" className="text-3xl font-bold text-teal-800">
            شحن الرصيد
          </Typography>
          <Typography className="text-blue-gray-600 mt-2">
            اختر المبلغ وطريقة الدفع لإتمام عملية الشحن
          </Typography>
        </div>

        <div className="space-y-8">
          {/* Amount Selection */}
          <div>
            <Typography className="text-blue-gray-700 mb-4 font-medium">
              اختر المبلغ:
            </Typography>
            <div className="flex gap-3 mb-6">
              {[1000, 500, 100].map((amount) => (
                <Button
                  key={amount}
                  onClick={() => handleAmountPress(amount)}
                  className={`rounded-xl text-sm w-40 transition-all ${
                    state.activeAmount === amount
                      ? "bg-teal-600 shadow-lg scale-105"
                      : "bg-blue-gray-100 text-blue-gray-700 hover:scale-105"
                  }`}
                >
                  {amount} دج
                </Button>
              ))}
            </div>

            <div className="!text-blue-gray-700 max-w-72 my-10">
              <Input
                type="number"
                color="teal"
                value={state.customAmount}
                onChange={handleInputChange}
                label="أو أدخل مبلغ مخصص"
                icon={<FaCreditCard className="text-teal-300" />}
                min="100"
                step="50"
                error={state.activeAmount > 0 && state.activeAmount < 100}
                labelProps={{ className: "!text-blue-gray-600" }}
              />
            </div>
            {state.activeAmount > 0 && state.activeAmount < 100 && (
              <Typography variant="small" color="red" className="mt-2">
                الحد الأدنى للشحن هو 100 دج
              </Typography>
            )}
          </div>

          {/* Payment Methods */}
          <div>
            <Typography className="text-blue-gray-700 mb-4 font-medium">
              طريقة الدفع:
            </Typography>
            <PaymentMethodsTabs
              onSelectTab={handleTabChange}
              className="bg-white rounded-xl p-2 shadow-sm"
            />
          </div>

          {/* Security Assurance */}
          <div className="bg-mangoBlack rounded-xl p-4 flex items-center gap-4 max-w-fit">
            <FaShieldAlt className="text-2xl text-teal-600 dark:text-teal-300" />
            <Typography className="text-teal-800 dark:text-teal-300 text-sm">
              جميع عمليات الدفع مشفرة وآمنة. نحن لا نخزن أي بيانات دفع حساسة.
            </Typography>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleRecharge}
            disabled={loading || !state.activeTab || state.activeAmount < 100}
            className="w-72 py-3 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-teal-600 to-blue-600"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner className="h-5 w-5" />
                جاري معالجة الطلب...
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <RiMoneyDollarCircleFill />
                تأكيد الشحن
              </span>
            )}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
