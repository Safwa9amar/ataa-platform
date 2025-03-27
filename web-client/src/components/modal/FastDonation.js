"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Spinner,
  Input,
  Typography,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
  Progress,
} from "@material-tailwind/react";
import { useTheme } from "../../context/ThemeContext";
import { FaShieldHeart } from "react-icons/fa6";
import { FastDonation } from "../vectors/Svg";
import PaymentMethodsTabs from "../UI/PaymentMathodesTabs";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import CONSTANTS from "@/config/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import API_ENDPOINTS from "@/config/apiEndPoints";
import useImageUpload from "@/hooks/useImageUpload";
import validator from "validator";
import { FileUploader } from "react-drag-drop-files";
import Image from "next/image";
import { useCredentials } from "@/context/CredentialsContext";
import { useFieldCategoryContext } from "@/context/FieldCategoryContext";
import Link from "next/link";
import { BiLink } from "react-icons/bi";
const MySwal = withReactContent(Swal);

const FastDonationModal = ({ isScrolled, isHomePage }) => {
  const { user, isLoggedIn } = useCredentials();
  const router = useRouter();
  const [state, setState] = useState({});
  const {
    uploadedFile,
    isUploading,
    uploadProgress,
    uploadImage,
    setUploadedFile,
  } = useImageUpload();
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState("");
  const isBaridiMob = state.activeTab === CONSTANTS.PAYMENT_METHODS.baridiMob;
  const isCcp = state.activeTab === CONSTANTS.PAYMENT_METHODS.ccp;
  const toggleModal = () => {
    setShowModal(!showModal);
    setState({});
    setUploadedFile(null);
    setValidationError("");
  };

  const handleFastDonation = async () => {
    setValidationError("");
    try {
      if (!state.activeBtn) return setValidationError("يرجى تحديد مجال التبرع");
      if (!state.activeAmount)
        return setValidationError("يرجى تحديد مبلغ التبرع");
      if (!state.activeTab) return setValidationError("يرجى تحديد طريق الدفع ");
      if (isCcp || isBaridiMob) {
        if (!uploadedFile) return setValidationError("يرجى رفع وصل العملية");
      }
      setShowModal(false);
      // Helper function to upload an image

      // Helper function to collect email
      const promptEmailInput = async () => {
        const { value: email } = await MySwal.fire({
          title: "ادخل بريدك الالكتروني حتى تحصل وصل عملية التبرع",
          input: "email",
          allowOutsideClick: false,
          showCloseButton: true,
          preConfirm: (value) => {
            if (!value || !/\S+@\S+\.\S+/.test(value)) {
              MySwal.showValidationMessage("يرجى إدخال بريد إلكتروني صحيح.");
            }
            return value;
          },
        });

        if (!email) {
          throw new Error("البريد الإلكتروني مطلوب لإتمام عملية التبرع.");
        }

        return email;
      };

      // Handle BaridiMob and CCP payments
      if (state.activeTab === CONSTANTS.PAYMENT_METHODS.baridiMob) {
        const email = await promptEmailInput();
        // Submit donation details
        let { data } = await axios.post(
          API_ENDPOINTS.FAST_DONATION.BARIDI_MOB,
          {
            field: state.activeBtn,
            paymentMethode: state.activeTab,
            amount: parseFloat(state.activeAmount),
            screenShoot: uploadedFile,
            email,
          }
        );
        const { donationOpportunity } = data;

        setState({});

        return MySwal.fire({
          title: "تم التبرع بنجاح",
          html: (
            <>
              <div className="space-y-5">
                <p>منصة عطاء تشكرك على التبرع بمبلغ {state.activeAmount} دج</p>
                <p>
                  لقم تم تبرعك للحالة الاشد احتياجات تحت عنوان :{" "}
                  {donationOpportunity.title}
                </p>
              </div>
            </>
          ),
          preConfirm: (confirm) => {
            confirm &&
              router.push(`/donation-opportunity?id=${donationOpportunity.id}`);
          },
          confirmButtonText: "زيارة الحالة",
          showCloseButton: true,
          customClass: {
            confirmButton: "rounded-full px-6 py-2 text-white bg-green-500",
          },
        });
      }

      // Handle Chargily payments
      if (state.activeTab === CONSTANTS.PAYMENT_METHODS.chargeLi) {
        const res = await axios.get(
          `${API_ENDPOINTS.FAST_DONATION.CHARGILY}/${state.activeBtn}/${state.activeAmount}`
        );
        const { checkout_url } = res.data;

        if (!checkout_url) {
          throw new Error("فشل في إنشاء رابط الدفع. يرجى المحاولة مرة أخرى.");
        }

        return router.push(checkout_url);
      }

      // Handle Stripe payments (to be implemented)
      if (state.activeTab === CONSTANTS.PAYMENT_METHODS.stripe) {
        const res = await axios.get(
          `${API_ENDPOINTS.FAST_DONATION.STRIPE}/${state.activeBtn}/${state.activeAmount}`
        );
        const { url } = res.data;

        if (!url) {
          throw new Error("فشل في إنشاء رابط الدفع. يرجى المحاولة مرة أخرى.");
        }

        return router.push(url);
      }
    } catch (error) {
      console.error("Error in donation process:", error);

      MySwal.fire({
        icon: "error",
        title: "حدث خطأ أثناء عملية التبرع",
        text: error.message || "يرجى المحاولة مرة أخرى لاحقًا.",
      });
    }
  };

  if (user?.role !== "donor" && isLoggedIn) return null;

  return (
    <>
      {/* Button to open the modal */}
      <IconButton
        className="m-0 hover:bg-blue-gray-200 dark:hover:bg-gray-800"
        variant="text"
        onClick={toggleModal}
      >
        <FastDonation
          startColor={isHomePage && !isScrolled ? "#FFF" : "#00796b"}
          stopColor={isHomePage && !isScrolled ? "#FFF" : "#007960"}
          className="text-xl scale-125 "
        />
      </IconButton>
      <Dialog className="bg-mangoBlack" open={showModal} handler={toggleModal}>
        <DialogHeader className="flex justify-center">
          <Typography
            variant="h4"
            className="font-ElMessiri text-center text-textColor py-5"
          >
            التبرع السريع
          </Typography>
        </DialogHeader>
        <DialogBody
          divider
          dir="rtl"
          className="flex flex-col items-center gap-8 overflow-y-auto h-[600px]"
        >
          {validationError && (
            <Typography
              className="text-center my-2 font-ElMessiri text-md"
              color="red"
            >
              {validationError}
            </Typography>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DonationType setState={setState} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <DonationAmount state={state} setState={setState} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Input
              label="مبلغ آخر"
              type="number"
              value={state.activeAmount}
              variant="outlined"
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  activeAmount: e.target.value,
                }))
              }
              className="w-full"
              color="green"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Typography className="text-center text-textColor font-ElMessiri">
              سيذهب تبرعك تلقائيا الى الحالات الأشد احتياجا
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <PaymentMethodsTabs
              center
              selectedTab={state.activeTab}
              onSelectTab={(tab) =>
                setState((prevState) => ({
                  ...prevState,
                  activeTab: tab,
                }))
              }
            />
            {(state.activeTab === CONSTANTS.PAYMENT_METHODS.baridiMob ||
              state.activeTab === CONSTANTS.PAYMENT_METHODS.ccp) && (
              <div className="w-full flex justify-center items-center m-5 px-5">
                {isUploading ? (
                  <div className="w-5/6">
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <Typography color="blue-gray" variant="h6">
                        جاري الرفع
                      </Typography>
                      <Typography color="blue-gray" variant="h6">
                        {uploadProgress}%
                      </Typography>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                ) : uploadedFile ? (
                  <img
                    className="rounded-md w-full h-[150px] self-center"
                    alt={uploadedFile?.filename}
                    src={`${process.env.NEXT_PUBLIC_API_UPLOADS_URL}/${uploadedFile?.filename}`}
                  />
                ) : (
                  <div className="space-y-5 text-center">
                    <FileUploader
                      handleChange={(files) => uploadImage(files)}
                      name="file"
                      multiple
                      types={["JPG", "PNG", "JPEG"]}
                      label="قم باختيار أو اسقاط صورة"
                      uploadedLabel="تم رفم الصورة بنجاح يمكنك رفم المزيد"
                    />
                    <Typography className="w-96">
                      ايضا قم بارسال وصل عملية الدفع من خلال تطبيق بريدي موب الى
                      البريد الالكتروني للمنصة
                      <br />
                      {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
                    </Typography>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex items-center justify-center gap-2 bg-teal-900 rounded-lg p-3 text-white"
          >
            <Typography className="font-ElMessiri">
              تبرعك محمي بالكامل ولا يتم تخزين بياناتك الشخصية
            </Typography>
            <FaShieldHeart size={30} color="white" />
          </motion.div>
        </DialogBody>
        <DialogFooter className="flex justify-center">
          <Button
            variant="text"
            color="red"
            onClick={toggleModal}
            className="mr-1 rounded-full"
          >
            <span>إغلاق</span>
          </Button>
          <Button
            disabled={isUploading}
            className="rounded-full"
            variant="gradient"
            color="green"
            onClick={handleFastDonation}
          >
            <span>تبرع الآن</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

const DonationType = ({ setState }) => {
  const { fields } = useFieldCategoryContext();
  // Local state for managing the active button
  const [activeBtn, setActiveBtn] = useState("");

  // Handler to update the active button
  const handleSetActiveBtn = (btn) => {
    setState((prevState) => ({ ...prevState, activeBtn: btn }));
    setActiveBtn(btn);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4" dir="ltr">
      {fields.map((btn) => (
        <Button
          key={btn.id}
          onClick={() => handleSetActiveBtn(btn.id)}
          variant={activeBtn === btn.id ? "gradient" : "outlined"}
          color={"green"}
          className="rounded-full"
        >
          {btn.ar_title}
        </Button>
      ))}
    </div>
  );
};

const DonationAmount = ({ setState, state }) => {
  // Local state for managing the active amount
  // const [activeAmount, setActiveAmount] = useState(state.activeAmount);

  // Handler to update the active amount
  const handleAmountPress = (amount) => {
    setState((prevState) => ({ ...prevState, activeAmount: amount }));
    // setActiveAmount(amount);
  };

  return (
    <div className="flex justify-center gap-4" dir="ltr">
      {[1000, 500, 100].map((amount) => (
        <Button
          key={amount}
          onClick={() => handleAmountPress(amount)}
          variant={state.activeAmount === amount ? "gradient" : "outlined"}
          color={"green"}
          className="rounded-full"
        >
          {amount} دج
        </Button>
      ))}
    </div>
  );
};

export default FastDonationModal;
