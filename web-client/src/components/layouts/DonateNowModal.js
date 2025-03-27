import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  Typography,
  Tooltip,
  Spinner,
  Dialog,
} from "@material-tailwind/react";
import { FaShieldAlt, FaInfoCircle } from "react-icons/fa";

const DonateNowModal = ({ open, onClose, donationData }) => {
  const { closeDonationModal } = useDonationModalContext();
  const route = useRoute();
  const navigation = useNavigation();
  const data = route.params?.donationData;

  const { user, userToken, checkAuthentication, isLoggedIn } = useCredentials();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [recipientPhoto, setRecipientPhoto] = useState(null);
  const timer = useRef();
  const { clearCart } = useCart();
  const [disbaleDonateBtn, setDisableDonateBtn] = useState(false);
  const [state, setState] = useState({
    activeBtn: "مشاريع",
    activeAmount: data?.cartTotalAmount || 0,
    activeTab: "",
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
  const handleDonateNow = async () => {
    // CampaignType
    // unitPrice
    if (state.activeTab === "usePoints" && state.activeAmount === 0) {
      setAlert({
        msg: "الرجاء ادخال عدد النقاط الذي تريد تحويله",
        type: "error",
      });
      return;
    }
    if (state.activeAmount < 100) {
      setAlert({
        msg:
          state.activeAmount === 0
            ? "الرجاء اختيار مبلغ"
            : "الحد الأدنى للتبرع هو 100 دج",
        type: "error",
      });
      return;
    }

    if (!state.activeTab) {
      setAlert({
        msg: "الرجاء اختيار طريقة الدفع",
        type: "error",
      });
      return;
    }
    if (
      (state.activeTab === "Baridi" || state.activeTab === "BaridiMob") &&
      recipientPhoto === null
    ) {
      setAlert({
        msg: "الرجاء تحميل صورة الإيصال",
        type: "error",
      });
      return;
    }
    if (
      state.activeTab === "useBalance" &&
      state.activeAmount > user.currentBalance
    ) {
      setAlert({
        msg: "رصيدك الحالي غير كافي بمكنك شحن حسابك عل من هنا",
        type: "error",
        action: () => {
          navigation.navigate("CharingDonationHistory");
          closeDonationModal();
        },
      });
      return;
    }
    if (!isLoggedIn) {
      setAlert({
        msg: "الرجاء تسجيل الدخول او انشاء حساب حتى تتمكن من التبرع",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      let screenShoot =
        (state.activeTab === "Baridi" || state.activeTab === "BaridiMob") &&
        (await uploadFileService(recipientPhoto.assets));

      if (data.isCalculatedZakat) {
        //  convert zakatData arr to object
        const zakatData = data.zakatData.reduce((acc, curr) => {
          acc[curr.amountType] = curr.amount;
          return acc;
        }, {});
        await createZakat(
          {
            ...zakatData,
            zakatTotal: data?.cartTotalAmount,
            donatedZakat: state.activeAmount,
          },
          userToken
        );
      }
      const res = await createDonation(
        {
          donationTypeID: data?.id, // Adjust based on the context
          donationType: data?.donationType, // Adjust based on the context
          amount: state.activeAmount,
          paymentMethod: state.activeTab,
          screenShoot: screenShoot,
          userId: user.id,
          cartData: data?.cartData,
        },
        userToken
      );
      if (res) {
        checkAuthentication(userToken);
        setAlert({
          msg: "تمت عملية التبرع بنجاح",
          type: "success",
        });
        setDisableDonateBtn(true);
        data.donationType === CONSTANTS.DONATION_TYPES.CART && clearCart();
        timer.current = setTimeout(() => {
          closeDonationModal();
        }, 3000);
        navigation.setParams({ refrech: true });
      }
    } catch (error) {
      console.error(error.message);
      setAlert({
        msg: "فشل التبرع، الرجاء المحاولة مرة اخرى",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  return (
    <Dialog open={open} onClose={onClose} size="lg" className="p-6" dir="rtl">
      <div className="bg-gradient-to-br from-blue-50 via-white to-gray-100 p-8 rounded-lg shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <Typography variant="h4" className="font-bold text-blue-700">
            تبرع الآن
          </Typography>
          <Typography variant="small" className="text-gray-500">
            {donationData?.description ||
              "اختر المبلغ وطريقة الدفع لإتمام التبرع"}
          </Typography>
        </div>

        {/* Amount Selection */}
        <div className="mb-6">
          <Typography variant="h6" className="text-gray-700 mb-2">
            اختر المبلغ
          </Typography>
          <div className="flex justify-around gap-4 my-5">
            {[100, 200, 500, 1000].map((amount) => (
              <Button
                key={amount}
                variant={
                  state.activeAmount === amount ? "gradient" : "outlined"
                }
                color={state.activeAmount === amount ? "cyan" : ""}
                className="px-6 py-3 hover:scale-105 transition-transform w-32 h-20 rounded-3xl"
                onClick={() => handleAmountPress(amount)}
              >
                {amount} دج
              </Button>
            ))}
          </div>
          <Input
            label="مبلغ آخر"
            type="number"
            value={state.activeAmount}
            onChange={handleInputChange}
            className="mt-4 my-5 mx-auto w-64"
            color="blue"
            variant="standard"
          />
        </div>

        {/* Payment Method */}
        <div className="mb-6 mt-10">
          <Typography variant="h6" className="text-gray-700 mb-2">
            اختر طريقة الدفع
            <Tooltip content="اختر الطريقة المناسبة لك لإتمام عملية الدفع">
              <FaInfoCircle className="inline ml-2 text-gray-500 cursor-pointer" />
            </Tooltip>
          </Typography>
          <div className="flex justify-center gap-4">
            {["Baridi", "BaridiMob", "Cash", "Stripe"].map((tab) => (
              <Button
                key={tab}
                variant={state.activeTab === tab ? "gradient" : "outlined"}
                className="hover:scale-105 transition-transform"
                onClick={() => handleSetActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        {/* Receipt Upload */}
        {(state.activeTab === "Baridi" || state.activeTab === "BaridiMob") && (
          <div className="mb-6">
            <Typography variant="small" className="text-gray-700 mb-2">
              تحميل صورة الإيصال
            </Typography>
            <Input
              type="file"
              onChange={(e) => setRecipientPhoto(e.target.files[0])}
              className="border p-2 rounded-lg w-full"
            />
          </div>
        )}

        {/* Security Message */}
        <div className="flex items-center gap-2 bg-blue-100 p-4 rounded-lg mb-6">
          <FaShieldAlt className="text-blue-500" size={24} />
          <Typography variant="small">
            تبرعك محمي بالكامل ولا يتم تخزين بياناتك الشخصية
          </Typography>
        </div>

        {/* Alert Message */}
        {alert && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {alert}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleDonateNow}
            color="green"
            disabled={loading}
            className="w-full px-6 py-3"
          >
            {loading ? <Spinner className="h-6 w-6" /> : "تبرع الآن"}
          </Button>
          <Button
            variant="text"
            color="gray"
            onClick={onClose}
            className="w-full px-6 py-3"
          >
            إغلاق
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default DonateNowModal;
