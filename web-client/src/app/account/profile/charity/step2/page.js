"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input, Button, Textarea, Typography } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { updateCharity } from "@/services/charityService";
import { useCredentials } from "@/context/CredentialsContext";
import { useRouter } from "next/navigation";
import validator from "validator";

export default function CharityStep2() {
  const { user, userToken, isLoggedIn, checkAuthentication } = useCredentials();
  const router = useRouter();
  if (!isLoggedIn) router.replace("/account/login");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      step2Completed: true,
      mainActivities: "",
      majorAchievements: "",
      mainGoals: "",
      currentChallenges: "",
      organizationalChart: "",
      financialManagement: "",
      aidDistribution: "",
      partnershipPrograms: "",
      volunteersCount: "",
      eventsCount: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateCharity(user.charity.id, data, userToken);
      Swal.fire({
        title: "تم التحديث بنجاح",
        text: "تم تحديث بيانات الجمعية، نشكرك على وفائك",
        icon: "success",
        didDestroy: async () => {
          await checkAuthentication(userToken);
          router.push("/account/profile");
        },
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "خطأ",
        text: "حدث خطأ ما، حاول مرة أخرى.",
        icon: "error",
      });
    }
  };

  return (
    <div className="container ml-auto w-1/2 p-6" dir="rtl">
      <Typography variant="h4" className="mb-4">
        الأنشطة والإنجازات
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Textarea
          label="ما هي أنشطتكم الرئيسية؟"
          {...register("mainActivities", {
            required: "يرجى إدخال الأنشطة الرئيسية للجمعية",
          })}
        />
        {errors.mainActivities && (
          <p className="text-red-400 text-sm">
            {errors.mainActivities.message}
          </p>
        )}

        <Textarea
          label="ما هي أهم إنجازاتكم؟"
          {...register("majorAchievements", {
            required: "يرجى إدخال الإنجازات الرئيسية للجمعية",
          })}
        />
        {errors.majorAchievements && (
          <p className="text-red-400 text-sm">
            {errors.majorAchievements.message}
          </p>
        )}

        <Textarea
          label="ما هي أهدافكم الرئيسية؟"
          {...register("mainGoals", {
            required: "يرجى إدخال الأهداف الرئيسية للجمعية",
          })}
        />
        {errors.mainGoals && (
          <p className="text-red-400 text-sm">{errors.mainGoals.message}</p>
        )}

        <Textarea
          label="ما هي التحديات الحالية؟"
          {...register("currentChallenges", {
            required: "يرجى إدخال التحديات الحالية للجمعية",
          })}
        />
        {errors.currentChallenges && (
          <p className="text-red-400 text-sm">
            {errors.currentChallenges.message}
          </p>
        )}

        <Input
          type="file"
          label="هيكلية المنظمة (إذا كان متاحًا)"
          {...register("organizationalChart")}
        />

        <Textarea
          label="كيف تديرون أموركم المالية؟"
          {...register("financialManagement", {
            required: "يرجى إدخال كيفية إدارة الأمور المالية",
          })}
        />
        {errors.financialManagement && (
          <p className="text-red-400 text-sm">
            {errors.financialManagement.message}
          </p>
        )}

        <Textarea
          label="ما هي نسبة كل نوع من أنواع المساعدة التي تتلقاها الجمعية؟"
          {...register("aidDistribution", {
            required: "يرجى إدخال نسبة أنواع المساعدة",
          })}
        />
        {errors.aidDistribution && (
          <p className="text-red-400 text-sm">
            {errors.aidDistribution.message}
          </p>
        )}

        <Input
          label="كم عدد البرامج التي تم إنجازها؟"
          type="number"
          {...register("partnershipPrograms", {
            required: "يرجى إدخال عدد البرامج",
            valueAsNumber: true,
          })}
        />
        {errors.partnershipPrograms && (
          <p className="text-red-400 text-sm">
            {errors.partnershipPrograms.message}
          </p>
        )}

        <Input
          label="كم عدد المتطوعين؟"
          type="number"
          {...register("volunteersCount", {
            required: "يرجى إدخال عدد المتطوعين",
            valueAsNumber: true,
          })}
        />
        {errors.volunteersCount && (
          <p className="text-red-400 text-sm">
            {errors.volunteersCount.message}
          </p>
        )}

        <Input
          label="كم عدد الفعاليات؟"
          type="number"
          {...register("eventsCount", {
            required: "يرجى إدخال عدد الفعاليات",
            valueAsNumber: true,
          })}
        />
        {errors.eventsCount && (
          <p className="text-red-400 text-sm">{errors.eventsCount.message}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="mt-4">
          {isSubmitting ? "جاري التحديث..." : "تحديث"}
        </Button>
      </form>
    </div>
  );
}
