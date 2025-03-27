import React, { useEffect, useState } from "react";
import { Button, Tooltip } from "@material-tailwind/react";
import Image from "next/image";
import CONSTANTS from "@/config/constants";

const PaymentMethodsTabs = ({ onSelectTab, selectedTab, center }) => {
  console.log(selectedTab);
  const [tab, setTab] = useState(selectedTab);
  // Mapping payment methods to their respective images and descriptions
  const paymentMethods = [
    {
      name: CONSTANTS.PAYMENT_METHODS.CIB,
      image: "/images/cib.png",
      description: "استخدم بوابة الدفع cib ",
    },
    {
      name: CONSTANTS.PAYMENT_METHODS.baridiMob,
      image: "/images/baridiMob.png",
      description: "استخدم تطبيق بريدي موب للدفع بسهولة وأمان.",
    },
    // {
    //   name: CONSTANTS.PAYMENT_METHODS.chargeLi,
    //   image: "/images/chargily.png",
    //   description: "اشحن حسابك أو ادفع باستخدام منصة شارجيلي.",
    // },
    {
      name: CONSTANTS.PAYMENT_METHODS.stripe,
      image: "/images/wp-stripe-donation.png",
      description: "ادفع باستخدام بطاقة الائتمان عبر منصة (Stripe) العالمية.",
    },
  ];
  useEffect(() => {
    setTab(selectedTab);
  }, [selectedTab]);
  // Function to handle tab selection
  const handleSelectTab = (tabName) => {
    if (onSelectTab) {
      onSelectTab(tabName); // Notify parent component
      setTab(tabName);
    }
  };

  return (
    <div className={`flex  gap-4 ${center ? "justify-center" : ""}`}>
      {paymentMethods.map((method) => (
        <Tooltip
          key={method.name}
          content={method.description}
          placement="bottom"
        >
          <Button
            variant={tab === method.name ? "gradient" : "outlined"}
            color="teal"
            className="hover:scale-105 transition-transform flex flex-col items-center"
            onClick={() => handleSelectTab(method.name)} // Call handler on click
          >
            {/* Payment Method Image */}
            <Image
              src={method.image}
              alt={method.name}
              width={40}
              height={40}
              className="mb-2 aspect-square"
            />
            {/* Payment Method Name */}
            {method.name}
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};

export default PaymentMethodsTabs;
