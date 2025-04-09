"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  Input,
  Typography,
  Tooltip,
  Spinner,
  Dialog,
  Slider,
  Card,
  CardBody,
} from "@material-tailwind/react";
import { FaShieldAlt, FaInfoCircle, FaMoneyCheckAlt } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useCredentials } from "@/context/CredentialsContext";
import { useCart } from "@/context/CartContext";
import DonationType from "./DonationTypeRenderer";
import { toast } from "react-toastify";
import uploadFileService from "@/services/uploadFileService";
import PaymentMethodsTabs from "@/components/UI/PaymentMathodesTabs";
import { createDonation } from "@/services/donationService";
import Swal from "sweetalert2";
import CONSTANTS from "@/config/constants";
import calculateSponsorshipAmount from "@/utils/calculateOrphaneDonationAmount";
import { createZakat } from "@/services/zakatServices";
import { useZakat } from "@/context/ZakatContext";
import { RiSecurePaymentFill } from "react-icons/ri";
import { FaUpload } from "react-icons/fa6";

// Define the TabButton component

const DonateNow = () => {
  const { user, userToken, checkAuthentication, isLoggedIn } = useCredentials();
  const { cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { zakatData, totalAmount: ZakatTotalAmount } = useZakat();

  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  const isOrphan = searchParams.get("orphan");
  const amount = searchParams.get("price");
  const isCalculatedZakat = searchParams.get("isCalculatedZakat" || false);
  const paymentMethode = searchParams.get("payment-methode");
  const sharingSource = searchParams.get("source");

  const data = {};
  const isCart = type === CONSTANTS.DONATION_TYPES.CART;

  const [loading, setLoading] = useState(false);
  const [recipientPhoto, setRecipientPhoto] = useState(null);

  const [state, setState] = useState({
    activeBtn: "مشاريع",
    activeAmount: isCart ? cartTotal : amount || 0,
    activeTab: paymentMethode || "",
    activeTime: "يوم",
    silderValue: 30,
  });

  const handleAmountPress = (amount) => {
    setState((prevState) => ({ ...prevState, activeAmount: amount }));
  };

  const handleSetActiveTab = (tab) => {
    setState((prevState) => ({ ...prevState, activeTab: tab }));
  };

  const handleInputChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      activeAmount: parseFloat(e.target.value) || 0,
    }));
  };

  const handleSliderChange = useCallback(
    (e) => {
      let value = Number(e.target.value).toFixed(0);
      setState((prevState) => ({
        ...prevState,
        activeAmount: calculateSponsorshipAmount(state.activeTime, value),
        silderValue: value,
      }));
    },
    [state.activeTime]
  );
  // New state for enhanced UI
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Enhanced file upload handling
  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) setRecipientPhoto(files);
  };

  const handleDonateNow = async () => {
    if (
      state.activeTab === "usePoints" &&
      state.activeAmount === 0 &&
      !isCart
    ) {
      toast.error("الرجاء ادخال عدد النقاط الذي تريد تحويله", {
        position: "bottom-left",
        toastId: 1,
      });
      return;
    }

    if (state.activeAmount < 100 && !isCart) {
      toast.error(
        state.activeAmount === 0
          ? "الرجاء اختيار مبلغ"
          : "الحد الأدنى للتبرع هو 100 دج",
        {
          position: "bottom-left",
          toastId: 2,
        }
      );
      return;
    }

    if (!state.activeTab) {
      toast.error("الرجاء اختيار طريقة الدفع", {
        position: "bottom-left",
        toastId: 3,
      });
      return;
    }

    if (
      (state.activeTab === CONSTANTS.PAYMENT_METHODS.ccp ||
        state.activeTab === CONSTANTS.PAYMENT_METHODS.baridiMob) &&
      recipientPhoto === null
    ) {
      toast.error("الرجاء تحميل صورة الإيصال", {
        position: "bottom-left",
        toastId: 4,
      });
      return;
    }

    if (
      state.activeTab === "useBalance" &&
      state.activeAmount > user.currentBalance
    ) {
      Swal.fire({
        text: "رصيدك الحالي غير كافي، يمكنك شحن حسابك.",
        icon: "error",
      }).then((result) => {
        if (result.isConfirmed)
          router.push("/account/profile/donor/balance-recharge");
      });
      return;
    }
    if (
      state.activeTab === "usePoints" &&
      state.activeAmount > user.ambassadorRank
    ) {
      Swal.fire({
        text: "عدد النقاط المدخل غير كافي، يمكنك الحصول على المزيد من النقاط عبر مشاركة فرص عطاء على مواقع التواصل.",
        icon: "error",
      });
      return;
    }

    if (!isLoggedIn) {
      toast.error("الرجاء تسجيل الدخول او انشاء حساب حتى تتمكن من التبرع", {
        position: "bottom-left",
        toastId: 5,
      });
      return;
    }
    const remainingAmount =  searchParams.get("remainingAmount");
    if(state.activeAmount > remainingAmount) {
      toast.error("الرجاء ادخال مبلغ اقل من المتبقي", {
        position: "bottom-left",
        toastId: 6,
      });
      return;
    }
    try {
      setLoading(true);

      // Redirect to payment link for Stripe or Chargily
      if (state.activeTab === "chargily") {
        return (window.location.href =
          "https://pay.chargily.com/test/payment-links/01hzsxjddrqmchtbt6b0zsj0fq"); // Redirect user to payment gateway
      }
      if (state.activeTab === "Stripe") {
        return (window.location.href =
          "https://buy.stripe.com/test_8wM2bP3tsc2ec8w9AA"); // Redirect user to payment gateway
      }

      // let screenShoot =
      //   (state.activeTab === CONSTANTS.PAYMENT_METHODS.ccp ||
      //     state.activeTab === CONSTANTS.PAYMENT_METHODS.baridiMob) &&
      //   (await uploadFileService(recipientPhoto));

      if (isCalculatedZakat) {
        await createZakat(
          {
            ...zakatData.reduce((acc, curr) => {
              acc[curr.amountType] = curr.amount;
              return acc;
            }, {}),
            zakatTotal: ZakatTotalAmount,
            donatedZakat: Number(state.activeAmount),
          },
          userToken
        );
      }

      const res = await createDonation(
        {
          donationTypeID: id,
          donationType: type,
          amount: Number(state.activeAmount),
          paymentMethod: state.activeTab,
          screenShoot: "",
          userId: user.id,
          cartData: data?.cartData,
          sharingSource,
        },
        userToken
      );

      if (res) {
        await checkAuthentication(userToken);
        Swal.fire({
          text: "تمت عملية التبرع بنجاح",
          icon: "success",
        }).then(() => {
          state.activeTab === "useBalance"
            ? router.push("/account/profile/donor/balance-uses")
            : router.push("/account/profile/donor/donation-history");
        });
        if (isCart) {
          clearCart();
        }
      }
    } catch (error) {
      console.error(error.message);
      Swal.fire({
        text: "فشل التبرع، الرجاء المحاولة مرة اخرى",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="grid md:grid-cols-2 place-items-center p-4 md:p-8  mx-auto"
    >
      <DonationType />

      <Card className="w-full max-w-2xl shadow-lg rounded-2xl bg-nav_bg">
        <CardBody className="p-6 md:p-8">
          <div className="mb-8 text-center">
            <Typography variant="h3" className="font-bold text-blue-800 mb-2">
              <RiSecurePaymentFill className="inline-block mr-2 mb-1" />
              إتمام التبرع
            </Typography>
            <Typography
              variant="lead"
              className="text-blue-gray-600 dark:text-blue-gray-50"
            >
              اختر طريقة الدفع والمبلغ المطلوب لإتمام عملية التبرع الآمنة
            </Typography>
          </div>

          {isOrphan ? (
            <div className="space-y-8">
              <div>
                <Typography
                  variant="h6"
                  className="text-blue-gray-700 dark:text-blue-gray-50   mb-4"
                >
                  اختر مدة الكفالة:
                </Typography>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["يوم", "اسبوع", "شهر", "السنة"].map((time) => (
                    <Button
                      key={time}
                      variant={
                        state.activeTime === time ? "filled" : "outlined"
                      }
                      color="teal"
                      className={`rounded-full text-sm md:text-base ${
                        state.activeTime === time
                          ? "shadow-lg scale-105"
                          : "hover:scale-105"
                      } transition-transform`}
                      onClick={() =>
                        setState((prev) => ({ ...prev, activeTime: time }))
                      }
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <Slider
                  value={state.silderValue}
                  onChange={handleSliderChange}
                  min={1}
                  max={100}
                  step={1}
                  className="text-teal-500"
                  thumbClassName="[&::-webkit-slider-thumb]:bg-teal-600"
                  trackClassName="[&::-webkit-slider-runnable-track]:bg-teal-100"
                />
                <div className="flex justify-between text-blue-gray-600 dark:text-blue-gray-50">
                  <span>المدة المختارة:</span>
                  <span className="font-semibold text-teal-700">
                    {state.silderValue} {state.activeTime}
                  </span>
                </div>
                <div className="p-4 bg-teal-50 rounded-xl text-center">
                  <Typography variant="h5" className="text-teal-800">
                    المبلغ الإجمالي:{" "}
                    <span className="font-bold">
                      {state.activeAmount.toFixed(0)} دج
                    </span>
                  </Typography>
                </div>
              </div>
            </div>
          ) : (
            <div className={`space-y-8 ${isCart ? "hidden" : ""}`}>
              <div>
                <Typography
                  variant="h6"
                  className="text-blue-gray-700 dark:text-blue-gray-50 mb-4"
                >
                  اختر المبلغ:
                </Typography>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[100, 200, 500, 1000].map((amount) => (
                    <Button
                      key={amount}
                      variant={
                        state.activeAmount === amount ? "filled" : "outlined"
                      }
                      color="teal"
                      className={`rounded-full ${
                        state.activeAmount === amount
                          ? "shadow-lg scale-105"
                          : "hover:scale-105"
                      } transition-transform`}
                      onClick={() => handleAmountPress(amount)}
                    >
                      {amount} دج
                    </Button>
                  ))}
                </div>
              </div>

              <Input
                label="مبلغ آخر"
                type="number"
                value={state.activeAmount}
                onChange={handleInputChange}
                icon={<FaMoneyCheckAlt className="text-blue-gray-400" />}
                className="!text-blue-gray-700 dark:text-blue-gray-50"
                min="100"
                step="50"
                error={state.activeAmount > 0 && state.activeAmount < 100}
                labelProps={{ className: "!text-blue-gray-600" }}
              />
              {state.activeAmount > 0 && state.activeAmount < 100 && (
                <Typography variant="small" color="red" className="mt-1">
                  الحد الأدنى للتبرع هو 100 دج
                </Typography>
              )}
            </div>
          )}

          <div className="my-8 space-y-6">
            <Typography
              variant="h6"
              className="text-blue-gray-700 dark:text-blue-gray-50"
            >
              طرق الدفع المتاحة:
              <Tooltip
                content="اختر الطريقة المناسبة لك"
                className="bg-teal-500 text-white"
              >
                <FaInfoCircle className="inline ml-2 text-blue-gray-400 cursor-help" />
              </Tooltip>
            </Typography>

            <PaymentMethodsTabs
              selectedTab={state.activeTab}
              onSelectTab={handleSetActiveTab}
              className="bg-white rounded-xl p-2 shadow-sm"
            />
            <Button
              onClick={() => handleSetActiveTab("useBalance")}
              variant={
                state.activeTab === "useBalance" ? "gradient" : "outlined"
              }
              color="cyan"
              className="px-6 py-3 hover:scale-105 transition-transform h-12 rounded-3xl"
            >
              استخدام الرصيد
            </Button>
            {state.activeTab === "useBalance" && (
              <div className="p-4 bg-teal-50 rounded-lg">
                <Typography className="text-teal-800 flex items-center gap-2">
                  <FaInfoCircle />
                  رصيدك المتاح: {user?.currentBalance} دج
                </Typography>
              </div>
            )}
          </div>

          {(state.activeTab === CONSTANTS.PAYMENT_METHODS.ccp ||
            state.activeTab === CONSTANTS.PAYMENT_METHODS.baridiMob) && (
            <div
              className={`border-2 ${
                dragActive
                  ? "border-teal-500"
                  : "border-dashed border-blue-gray-200"
              } rounded-xl p-6 text-center transition-colors`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleFileDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => setRecipientPhoto(e.target.files)}
                className="hidden"
              />
              <div className="space-y-4">
                <FaUpload className="text-3xl mx-auto text-blue-gray-400" />
                <Typography className="text-blue-gray-600">
                  اسحب وأفلت صورة الإيصال هنا أو{" "}
                  <button
                    type="button"
                    className="text-teal-600 hover:underline"
                    onClick={() => fileInputRef.current.click()}
                  >
                    اختر ملف
                  </button>
                </Typography>
                {recipientPhoto && (
                  <Typography className="text-sm text-green-700">
                    تم تحميل الملف: {recipientPhoto[0]?.name}
                  </Typography>
                )}
              </div>
              <Typography>
                قم بارسال وصل عملية الدفع من خلال تطبيق بريدي موب الى البريد
                الالكتروني للمنصة
                <br />
                {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
              </Typography>
            </div>
          )}

          <div className="mt-10 bg-mangoBlack rounded-xl p-4 flex items-center gap-4">
            <FaShieldAlt className="text-2xl text-teal-600" />
            <Typography className="text-teal-800 text-sm">
              جميع عمليات الدفع مشفرة وآمنة. نحن لا نخزن أي بيانات دفع حساسة.
            </Typography>
          </div>

          <Button
            onClick={handleDonateNow}
            color="teal"
            size="lg"
            fullWidth
            disabled={loading}
            className="mt-8 shadow-lg hover:shadow-xl transition-shadow rounded-full"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner className="h-5 w-5" />
                جاري المعالجة...
              </div>
            ) : (
              "تأكيد التبرع الآن"
            )}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default DonateNow;
