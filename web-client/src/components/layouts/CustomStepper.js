"use client";

import { Button, IconButton } from "@material-tailwind/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CustomStepper = ({
  steps,
  handleSubmit,
  validateStep,
  formData,
  setErrors,
  renderButtons,
  loading,
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  let stepParams = searchParams.get("step");
  const [activeStep, setActiveStep] = useState(Number(stepParams) || 0);

  const isLastStep = activeStep === steps.length - 1;
  const isFirstStep = activeStep === 0;

  const handleNext = async () => {
    if (!isLastStep) {
      let isValid = await validateStep(activeStep, formData, setErrors);
      if (!isValid) return;
      setActiveStep((cur) => cur + 1);
      router.push(`${pathName}?step=${activeStep + 1}`);
    }
  };
  const handlePrev = () => {
    !isFirstStep && setActiveStep((cur) => cur - 1);
    router.push(`${pathName}?step=${activeStep - 1}`);
  };

  const handleStepClick = async (index) => {
    if (index === activeStep) return;

    // Optional: Validate the current step before allowing navigation
    const isValid = await validateStep(activeStep, formData, setErrors);
    if (!isValid && index > activeStep) return;

    setActiveStep(index);
    router.push(`${pathName}?step=${index}`);
  };

  return (
    <div
      className="flex flex-col items-center w-full max-w-3xl mx-auto p-4"
      dir="rtl"
    >
      {/* Step Indicators */}
      <div className="flex justify-between items-center w-full mb-8">
        {steps.map((step, index) => (
          <div
            variant="text"
            onClick={() => handleStepClick(index)}
            key={index}
            className={`flex-1 text-center cursor-pointer relative ${
              index === activeStep
                ? "text-blue-600 font-bold"
                : "text-gray-400 font-normal"
            }`}
          >
            <div
              className={`w-10 h-10 mx-auto rounded-full border-2 flex items-center justify-center ${
                index <= activeStep ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {index + 1}
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`absolute -z-10 top-5 left-0 right-1/2 h-2 w-full bg-gradient-to-l transition ${
                  index < activeStep ? "from-blue-600" : "from-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="w-full bg-mangoBlack shadow p-6 rounded-lg">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-right">
          {steps[activeStep].title}
        </h2>
        <div className="text-right">{steps[activeStep].content}</div>
      </div>

      {/* Customizable Navigation Buttons */}
      {renderButtons ? (
        renderButtons({
          activeStep,
          handleNext,
          handlePrev,
          isLastStep,
          isFirstStep,
        })
      ) : (
        <div className="flex justify-end gap-4 items-center w-full mt-6">
          <Button
            onClick={handlePrev}
            disabled={isFirstStep}
            className={`rounded-full font-ElMessiri transition ${
              isFirstStep
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            العودة
          </Button>
          <Button
            loading={loading}
            onClick={isLastStep ? handleSubmit : handleNext}
            className={`rounded-full font-ElMessiri transition ${
              isLastStep
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isLastStep ? "إكمال التسجيل" : "التالي"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomStepper;
