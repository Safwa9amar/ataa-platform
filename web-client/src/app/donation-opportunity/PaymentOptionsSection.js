import DonateNowModal from "@/components/layouts/DonateNowModal";
import PaymentMethodsTabs from "@/components/UI/PaymentMathodesTabs";
import ToggleButtonGroup from "@/components/UI/ToggleButtonGroup";
import CONSTANTS from "@/config/constants";
import { useCart } from "@/context/CartContext";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FaCartArrowDown } from "react-icons/fa6";
import { toast } from "react-toastify";

function PaymentOptionsSection({ data }) {
  const { addToCart } = useCart();
  const [selectedMethod, setSelectedMethod] = useState(null);
  let isOrphan = useMemo(() => data?.category.title === "kafalat", [data]);
  const router = useRouter();
  const paymentMethods = [
    {
      label: (
        <div className="flex gap-2 items-center">
          <Image
            className="w-10 h-10"
            width={200}
            height={200}
            src={"/images/baridiMob.png"}
            alt="Baridi Mob"
          />
          <p>منصة بريدي موب</p>
        </div>
      ),
      value: CONSTANTS.PAYMENT_METHODS.baridiMob,
      description: "ادفع باستخدام تطبيق بريدي موب بسهولة وأمان.",
    },
    {
      label: (
        <div className="flex gap-2 items-center">
          <Image
            className="w-10 h-10"
            width={200}
            height={200}
            src={"/images/ccp.jpg"}
            alt="Algeria Post"
          />
          <p>عبر بريد الجزائر</p>
        </div>
      ),
      value: CONSTANTS.PAYMENT_METHODS.ccp,
      description: "استخدم حسابك البريدي الجاري لإتمام عملية الدفع.",
    },
    {
      label: "منصة Stripe العالمية",
      value: CONSTANTS.PAYMENT_METHODS.stripe,
      description: "ادفع باستخدام بطاقة الائتمان عبر منصة Stripe العالمية.",
    },
    {
      label: "منصة شارجيلي",
      value: CONSTANTS.PAYMENT_METHODS.chargeLi,
      description: "اشحن حسابك باستخدام خدمة شارجيلي المحلية.",
    },
  ];

  const handlePaymentSelection = (value) => {
    setSelectedMethod(value);
  };

  const handleDonation = () => {
    if (!selectedMethod) {
      toast.info("يرجى اختيار طريقة دفع أولاً", {
        position: "bottom-left",
        toastId: 1,
      });
      return;
    }
    router.push(
      `/donate-now?type=${CONSTANTS.DONATION_TYPES.DONATION_OPPOERTUNITY}&id=${
        data.id
      }&payment-methode=${selectedMethod}${isOrphan ? "&orphan=true" : ""}`
    );
  };

  return (
    <div className="relative w-full bg-paymentBG bg-no-repeat bg-cover bg-fixed text-white h-[35vh] flex items-center justify-center">
      <div className="w-full h-full md:p-20 text-center bg-black bg-opacity-50 flex flex-col gap-4 justify-center items-center">
        <Typography className="font-ElMessiri text-xl md:text-4xl">
          خيارات الدفع المتاحة عبر المنصة
        </Typography>

        <div className="scale-75 md:scale-100">
          <PaymentMethodsTabs onSelectTab={setSelectedMethod} />
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            className="font-ElMessiri bg-secondaryColor"
            onClick={handleDonation}
          >
            {isOrphan ? "اكفلني" : "تبرع الآن"}
          </Button>
          <IconButton
            onClick={() =>
              addToCart({
                ...data,
                screen: "DoantionCardDetaills",
                type: CONSTANTS.DONATION_TYPES.DONATION_OPPOERTUNITY,
                priceEditable: true,
                price: 0,
              })
            }
            variant="outlined"
            color="white"
            className="p-2"
          >
            <FaCartArrowDown color="white" size={26} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default PaymentOptionsSection;
