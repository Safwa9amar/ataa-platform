"use client";
import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Typography } from "@material-tailwind/react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import useCookies from "@/hooks/useCookies";
import stepValidationFields from "./stepValidationFields";
import { createCampaign } from "@/services/campaignServices";
import Swal from "sweetalert2";
import { useCredentials } from "@/context/CredentialsContext";
import useScrollToTop from "@/hooks/useScrollToTop";
import withAuth from "@/components/hoc/withAuth";
import withRegistrationStatus from "@/components/hoc/withRegistrationStatus";
import { useRouter } from "next/navigation";

const steps = [Step1, Step2, Step3, Step4, Step5];

function MultiStepForm() {
  const { userToken } = useCredentials();
  const scrollToTop = useScrollToTop();
  const { getCookie, setCookie, removeCookie } = useCookies();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Load form data from cookies
  const savedData = getCookie("bloodCampaignformData")
    ? JSON.parse(getCookie("bloodCampaignformData"))
    : {};
  const savedStep = getCookie("bloodCampaignCurrentStep")
    ? parseInt(getCookie("bloodCampaignCurrentStep"))
    : 0;

  const methods = useForm({
    defaultValues: {
      title: savedData.title,
      name: savedData.name,
      email: savedData.email,
      phone: savedData.phone,
      address: savedData.address,
      age: savedData.age,
      wilaya: savedData.wilaya,
      daira: savedData.daira,
      commune: savedData.commune,
      campaignStatus: savedData.campaignStatus,
      numOfBeneficiaries: savedData.numOfBeneficiaries,
      CampaignType: "BLOOD",
      images: savedData.images || [],
      proofFiles: savedData.proofFiles || [],
      selectedBloodType: savedData.selectedBloodType,
      bloodBankName: savedData.bloodBankName,
      googleMapLink: savedData.googleMapLink,
      numberOfUnits: savedData.numberOfUnits,
    },
    mode: "onSubmit",
  });

  const [step, setStep] = useState(savedStep);

  // Save form data to cookies on change
  useEffect(() => {
    const subscription = methods.watch((data) => {
      setCookie("bloodCampaignformData", JSON.stringify(data), { expires: 1 }); // Save for 1 day
    });
    return () => subscription.unsubscribe();
  }, [methods.watch]);

  // Save current step to cookies
  useEffect(() => {
    setCookie("bloodCampaignCurrentStep", step, { expires: 1 });
  }, [step]);

  // Validate and move to next step
  const nextStep = async () => {
    const fieldsToValidate = stepValidationFields[step];

    if (fieldsToValidate.length > 0) {
      const isValid = await methods.trigger(fieldsToValidate);
      console.log(isValid);
      if (!isValid) return;
    }

    setStep((prev) => prev + 1);
    scrollToTop();
  };

  const prevStep = () => {
    scrollToTop();
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await createCampaign(data, userToken);

      await Swal.fire({
        title: "تم التسجيل بنجاح",
        text: "تم تسجيل انشاء الحملة بنجاح. سيتم مراجعة الطلب من طرف ادارة المنصة.",
        icon: "success",
      });

      // انتقال بعد النجاح
      router.push("/our-programmes/blood-donation/my-campaigns?isAgreed=false");

      removeCookie("bloodCampaignformData");
      removeCookie("bloodCampaignCurrentStep"); // Clear data after submission
    } catch (error) {
      console.log(error);

      Swal.fire({
        text: "حدث خطأ ما. حاول مرة أخرى.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="p-6 space-y-8 flex flex-col  items-center justify-center"
    >
      <Typography variant="h3" className="text-center">
        انشاء حملة
      </Typography>

      {/* Step Indicators */}
      <div className="flex justify-between items-center min-w-[550px] mb-8">
        {steps.map((_, index) => (
          <div
            variant="text"
            key={index}
            className={`flex-1 text-center relative ${
              index === step
                ? "text-blue-600 font-bold"
                : "text-gray-400 font-normal"
            }`}
          >
            <div
              className={`w-10 h-10 mx-auto rounded-full border-2 flex items-center justify-center ${
                index <= step ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {index + 1}
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`absolute -z-10 top-5 left-0 right-1/2 h-2 w-full bg-gradient-to-l transition ${
                  index < step ? "from-blue-600" : "from-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5">
          {React.createElement(steps[step])}

          <div className="flex justify-end gap-5 mt-5">
            {step > 0 && (
              <Button
                className="rounded-full"
                color="gray"
                variant="outlined"
                onClick={prevStep}
              >
                السابق
              </Button>
            )}

            {step < steps.length - 1 && (
              <Button
                className="rounded-full"
                variant="gradient"
                color="blue"
                onClick={nextStep}
              >
                التالي
              </Button>
            )}
            {step === 4 && (
              <Button
                loading={loading}
                className="rounded-full"
                color="green"
                type="submit"
              >
                انشاء الحملة
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default withAuth(MultiStepForm);
