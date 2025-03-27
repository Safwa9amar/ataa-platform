"use client";
import React from "react";
import GoalsSection from "./Goals";
import Definition from "./Definition";
import Vision from "./Vision";
import Benefits from "./Benefits";
import DonationCat from "./DonationCat";

export default function AboutAtaa() {
  return (
    <div className="" dir="rtl">
      <Definition />
      <div className="container mx-auto px-4 py-8">
        <Vision />
        <GoalsSection />
        <Benefits />
        <DonationCat />
      </div>
    </div>
  );
}
