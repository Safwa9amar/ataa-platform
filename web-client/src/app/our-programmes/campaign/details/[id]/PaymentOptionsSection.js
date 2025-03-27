import DonateNowModal from "@/components/layouts/DonateNowModal";
import PaymentMethodsTabs from "@/components/UI/PaymentMathodesTabs";
import ToggleButtonGroup from "@/components/UI/ToggleButtonGroup";
import CONSTANTS from "@/config/constants";
import { useCart } from "@/context/CartContext";
import { useCredentials } from "@/context/CredentialsContext";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaCartArrowDown } from "react-icons/fa6";
import { toast } from "react-toastify";

function PaymentOptionsSection({ data }) {
  const { user } = useCredentials();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleDonation = () => {
    if (!selectedMethod) {
      toast.info("يرجى اختيار طريقة دفع أولاً", {
        position: "bottom-left",
        toastId: 1,
      });
      return;
    }
    router.push(
      `/donate-now?type=${CONSTANTS.DONATION_TYPES.CAMPAIGN}&id=${data.id}&payment-methode=${selectedMethod}`
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
          {data.isAgreed && (
            <Button
              className="font-ElMessiri bg-secondaryColor"
              onClick={handleDonation}
            >
              تبرع الآن
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentOptionsSection;
