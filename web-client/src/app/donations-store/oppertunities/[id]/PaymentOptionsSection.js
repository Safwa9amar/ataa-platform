import DonateNowModal from "@/components/layouts/DonateNowModal";
import ToggleButtonGroup from "@/components/UI/ToggleButtonGroup";
import CONSTANTS from "@/config/constants";
import { useCart } from "@/context/CartContext";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaCartArrowDown } from "react-icons/fa6";
import { toast } from "react-toastify";

function PaymentOptionsSection({ data }) {
  const { addToCart } = useCart();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      `/donate-now?type=${CONSTANTS.DONATION_TYPES.DONATION_OPPOERTUNITY}&id=${data.id}&payment-methode=${selectedMethod}`
    );
  };

  return (
    <div
      className="relative w-full bg-no-repeat bg-cover bg-fixed text-white h-[50vh] flex items-center justify-center"
      style={{
        clipPath: "polygon(3% 0, 100% 0%, 97% 98%, 0% 100%)",
        backgroundImage: `url(https://sslcommerz.com/wp-content/uploads/2024/04/How-Online-Payment-Gateways-Work.png)`,
      }}
    >
      <div className="w-full h-full md:p-20 text-center bg-black bg-opacity-75 flex flex-col gap-4 justify-center items-center">
        <Typography variant="h3" className="font-ElMessiri">
          خيارات الدفع المتاحة عبر المنصة
        </Typography>
        <ToggleButtonGroup
          getButtonStyles={(cond) => ({
            variant: cond ? "gradient" : "outlined",
            color: cond ? "indigo" : "white",
            className: `font-ElMessiri text-white flex items-center gap-2`,
          })}
          options={{
            label: "",
            choices: paymentMethods.map((method) => ({
              label: method.label,
              value: method.value,
            })),
          }}
          selectedOption={selectedMethod}
          setSelectedOption={handlePaymentSelection}
        />
        {selectedMethod && (
          <div className="mt-4 bg-gray-800 p-4 rounded-lg">
            <p>
              {
                paymentMethods.find((method) => method.value === selectedMethod)
                  ?.description
              }
            </p>
          </div>
        )}
        <div className="flex gap-3 mt-6">
          <Button
            className="font-ElMessiri bg-secondaryColor"
            onClick={handleDonation}
          >
            تبرع الآن
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
      {/* <DonateNowModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDonate={() => alert("qweqwe")}
      /> */}
    </div>
  );
}

export default PaymentOptionsSection;
