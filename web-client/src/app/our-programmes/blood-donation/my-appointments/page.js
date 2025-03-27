"use client";

import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";

import { getAppointmentByUserId } from "@/services/appointmentsServices"; // Ensure this is adapted for Next.js
import { useCredentials } from "@/context/CredentialsContext";
import CONSTANTS from "@/config/constants";
import TabItem from "@/components/UI/TabItem";
import { GoChecklist } from "react-icons/go";
import { IoPeopleCircleOutline } from "react-icons/io5";
import { FaBus } from "react-icons/fa6";

export default function MyAppointments() {
  const { user, userToken, isLoggedIn } = useCredentials();
  const [activeTab, setActiveTab] = useState("all");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const appointmentsTypes = [
    {
      status: "all",
      ar_status: "الكل",
      color: "black",
      icon: (active) => (
        <GoChecklist
          size={18}
          color={`${active ? "text-white" : "text-black"}`}
        />
      ),
    },
    {
      status: CONSTANTS.CAMPAIGN_USER_CREATETOR_TYPES.USERCAMPAIGN,
      ar_status: "حملات المستخدمين",
      color: "red",
      icon: (active) => (
        <IoPeopleCircleOutline
          size={18}
          color={`${active ? "text-white" : "text-black"}`}
        />
      ),
    },
    {
      status: CONSTANTS.CAMPAIGN_USER_CREATETOR_TYPES.NATIONALCAMPAIGN,
      ar_status: "الحملات الوطنية",
      color: "blue",
      icon: (active) => (
        <FaBus size={18} color={`${active ? "text-white" : "text-black"}`} />
      ),
    },
  ];

  const fetchAppointments = async () => {
    setLoading(true);
    const data = await getAppointmentByUserId(user.id, userToken);
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => {
    isLoggedIn && fetchAppointments();
  }, [isLoggedIn, userToken]);

  const filteredAppointments = appointments.filter((appointment) =>
    activeTab === "all" ? true : appointment.type === activeTab
  );

  return (
    <div dir="rtl" className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">مواعيدي</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-auto mb-6">
        {appointmentsTypes.map((type) => (
          <TabItem
            key={type.status}
            isActive={activeTab === type.status}
            onClick={() => setActiveTab(type.status)}
            bgColor={activeTab === type.status ? type.color : "gray-200"}
            icon={type.icon(activeTab === type.status)}
            label={type.ar_status}
          />
        ))}
      </div>

      {/* Appointments List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : filteredAppointments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">لا توجد مواعيد.</p>
      )}
    </div>
  );
}

const AppointmentCard = ({ appointment }) => {
  const { campaign, nationalCampaign, createdAt, date, isDone } = appointment;

  return (
    <div className="border border-borderColor p-4 rounded-lg shadow-md bg-mangoBlack">
      <h2 className="text-lg font-semibold mb-2">
        {campaign?.title || nationalCampaign?.campaignName}
      </h2>
      <p className="text-sm text-gray-600 mb-2">
        حالة الحملة: {CONSTANTS.CAMPAIGNSTATUS[campaign?.campaignStatus]}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        تاريخ وتوقيت حجز الموعد:{" "}
        {dayjs(createdAt).format("A HH:mm - DD/MM/YYYY")}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        تاريخ موعد التبرع:{" "}
        {date ? dayjs(date).format("DD/MM/YYYY") : "لم يتم تحديد موعد"}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        توقيت موعد التبرع: {date ? dayjs(date).format("HH:mm A") : "/"}
      </p>

      <div className="flex justify-end gap-3 space-x-4 mt-4">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            isDone ? "bg-green-500 text-white" : "bg-yellow-500 text-black"
          }`}
        >
          {isDone ? "تم التبرع" : "لم يتم التبرع"}
        </span>

        <a
          href={campaign?.googleMapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          {campaign?.googleMapLink ? "فتح الخريطة" : "الخريطة غير متوفرة"}
        </a>
      </div>
    </div>
  );
};
