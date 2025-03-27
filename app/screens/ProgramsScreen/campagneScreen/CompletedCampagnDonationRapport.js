import { View, Text, Image } from "react-native";
import React from "react";
import ScreensContainer from "../../../components/ScreensContainer";

export default function CompletedCampagnDonationRapport() {
  return (
    <ScreensContainer>
      <Image
        source={require("../../../assets/logo/fullLogo.png")}
        style={{ width: "100%", height: 225, borderRadius: 10 }}
      />
      
    </ScreensContainer>
  );
}
