"use client";
import React, { useState } from "react";
import { useCredentials } from "@/context/CredentialsContext";
import { createAppointment } from "@/services/appointmentsServices";
import { Button, Typography } from "@material-tailwind/react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import validator from "validator";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  email: "",
  phone: "",
  age: 30,
  selectedBloodType: null,
};

const bloodNames = [
  { name: "A+", code: "A_POSITIVE" },
  { name: "A-", code: "A_NEGATIVE" },
  { name: "B+", code: "B_POSITIVE" },
  { name: "B-", code: "B_NEGATIVE" },
  { name: "O+", code: "O_POSITIVE" },
  { name: "O-", code: "O_NEGATIVE" },
  { name: "AB+", code: "AB_POSITIVE" },
  { name: "AB-", code: "AB_NEGATIVE" },
];

const BloodDonationBooking = ({ searchParams }) => {
  const campaignId = searchParams.query;
  const title = searchParams.title;
  const { user, userToken } = useCredentials();

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (key, value) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const validatePhoneNumber = (number) => {
    const dzdPhoneRegex = /^(05|06|07)\d{8}$/;
    return dzdPhoneRegex.test(number);
  };

  const validateData = () => {
    const { email, phone, selectedBloodType } = state;

    if (!email || !phone || !selectedBloodType) {
      toast.error("الرجاء ملء جميع الحقول", {
        position: "bottom-left",
        autoClose: 1000,
      });
      return false;
    }

    if (!validator.isEmail(email)) {
      toast.error("البريد الإلكتروني غير صالح", {
        position: "bottom-left",
        autoClose: 1000,
      });
      return false;
    }

    if (!validatePhoneNumber(phone)) {
      toast.error(
        "رقم الهاتف غير صالح. يجب أن يبدأ بـ 05، 06، أو 07 ويتكون من 10 أرقام",
        {
          position: "bottom-left",
          autoClose: 1000,
        }
      );
      return false;
    }

    return true;
  };

  const handleBooking = async () => {
    if (!validateData()) return;

    const bookingData = {
      email: state.email,
      phone: state.phone,
      age: state.age,
      bloodType: state.selectedBloodType,
      locationLink: "https://www.google.com/maps/place/36.7525,3.042",
      campaignId: campaignId,
      userId: user.id,
      type: "NATIONALCAMPAIGN",
    };

    setLoading(true);

    try {
      await createAppointment(bookingData, userToken);
      setLoading(false);

      Swal.fire({
        icon: "success",
        title: "تم حجز موعدك بنجاح",
        confirmButtonText: "موافق",
      });

      // Reset state after success
      setState(initialState);
    } catch (err) {
      console.error(err);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "حدث خطأ أثناء حجز موعدك",
        text: err,
        confirmButtonText: "موافق",
      });
    }
  };

  return (
    <div className="flex flex-col items-center p-4" dir="rtl">
      <div className="relative flex justify-center items-center w-full h-56">
        <h1 className="text-4xl w-full h-full bg-black bg-opacity-75 flex items-center justify-center text-white">
          {title}
          <br />
          {campaignId}#
        </h1>
        <img
          src={"/images/image47.png"}
          alt="Blood Donation"
          className="absolute -z-10 w-full h-56 object-cover rounded-lg"
        />
      </div>

      <div className="mt-6 space-y-4 w-full max-w-md">
        <div>
          <label className="block mb-1 text-gray-700">البريد الالكتروني</label>
          <input
            type="email"
            value={state.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">رقم الهاتف</label>
          <input
            type="tel"
            value={state.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">
            العمر ({state.age} سنة)
          </label>
          <input
            type="range"
            min="18"
            max="100"
            value={state.age}
            onChange={(e) => handleInputChange("age", Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">فصيلة الدم</label>
          <div className="flex gap-2 flex-wrap">
            {bloodNames.map((item) => (
              <button
                key={item.code}
                onClick={() =>
                  handleInputChange("selectedBloodType", item.code)
                }
                className={`p-2 rounded ${
                  state.selectedBloodType === item.code
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={handleBooking}
        className="mt-6 bg-red-600 text-white py-2 px-4 rounded-full font-ElMessiri text-lg w-96"
        loading={loading}
      >
        {loading ? "جاري الحجز..." : "طلب الموعد"}
      </Button>
    </div>
  );
};

export default BloodDonationBooking;
