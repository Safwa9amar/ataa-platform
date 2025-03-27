import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import FastDonationModal from "./FastDonationModal";
import DonateNowModal from "./DonateNowModal";
import IqfalniModal from "./IqfalniModal";
export default function DonationModal() {
//   const { closeDonationModal } = useDonationModalContext();
  const route = useRoute();
  const donationType = route.params?.typeOfDonation;
  useEffect(() => {
    console.log("render", route.name);
  }, []);
  return (
    {
      fastDonation: <FastDonationModal />,
      donateNow: <DonateNowModal />,
      ikfalni : <IqfalniModal />,
    }[donationType] || <Text>Invalid donation type</Text>
  );
}
