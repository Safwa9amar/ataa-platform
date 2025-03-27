"use client";
import Button from "@/components/UI/Button";
import React from "react";
import { useCredentials } from "@/context/CredentialsContext";
import { useEnums } from "@/context/EnumsContext";
import dayjs from "dayjs";
import { Tooltip } from "@material-tailwind/react";

const SubscriptionsPage = () => {
  const { user } = useCredentials();
  const { enums } = useEnums();
  const subscriptions = user?.subscriptions;
  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      {/* Subscription Details */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            بيانات العميل:
          </span>
          <span className="text-xl text-gray-700 dark:text-gray-300">
            {user.name}
          </span>
        </div>
        <div className="mt-4 text-gray-600 dark:text-gray-400">
          المدة المتبقية في الاشتراك الحالي:{" "}
          {dayjs(
            subscriptions?.find((sub) => sub.status === "ACTIVE")?.endDate
          ).diff(
            dayjs(
              subscriptions?.find((sub) => sub.status === "ACTIVE")?.startDate
            ),
            "days"
          )}{" "}
          يوم
        </div>
      </section>

      {/* Subscription List */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">
          قائمة الإشتراكات
        </h2>
        <table className="w-full text-right border-collapse border border-gray-300 dark:border-gray-600">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="border border-gray-300 dark:border-gray-600 p-2">
                رقم الاشتراك
              </th>
              <th className="border border-gray-300 dark:border-gray-600 p-2">
                نوع الباقة
              </th>
              <th className="border border-gray-300 dark:border-gray-600 p-2">
                تاريخ البداية
              </th>
              <th className="border border-gray-300 dark:border-gray-600 p-2">
                تاريخ الانتهاء
              </th>
              <th className="border border-gray-300 dark:border-gray-600 p-2">
                حالة الاشتراك
              </th>
              <th className="border border-gray-300 dark:border-gray-600 p-2">
                طريقة الدفع
              </th>
              <th className="border border-gray-300 dark:border-gray-600 p-2">
                الإجراء
              </th>
            </tr>
          </thead>
          <tbody>
            {subscriptions?.map((subscription) => (
              <tr
                key={subscription.id}
                className="text-gray-700 dark:text-gray-200"
              >
                <td className="border border-gray-300 dark:border-gray-600 p-2">
                  {subscription.id}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-2">
                  {subscription?.plan.title}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-2">
                  {dayjs(subscription.startDate).format("YYYY-MM-DD")}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-2">
                  {dayjs(subscription.endDate).format("YYYY-MM-DD")}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-2">
                  {subscription.status === enums.Status.ACTIVE ? (
                    <span className="text-green-500">مفعل</span>
                  ) : subscription.status === enums.Status.EXPIRED ? (
                    <span className="text-red-500">منتهي</span>
                  ) : subscription.status === enums.Status.PENDING ? (
                    <span className="text-yellow-500">قيد الانتظار</span>
                  ) : (
                    <span className="text-gray-500">غير معروف</span>
                  )}
                  {subscription.isEdited && (
                    <Tooltip color="light" content="تم تعديل الاشتراك">
                      <span className="text-blue-500"> (تم التعديل)</span>
                    </Tooltip>
                  )}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-2">
                  <div className="mt-4 text-gray-600 dark:text-gray-400">
                    تم الدفع بواسطة :{subscription.paymentMethod}
                  </div>
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-2 flex gap-3">
                  <Button
                    variant="outlined"
                    color="green"
                    className="rounded-full hover:bg-green-600 dark:hover:bg-green-800 hover:text-white dark:hover:text-gray-200"
                  >
                    تعديل الاشتراك
                  </Button>
                  {/* <Button
                    variant="outlined"
                    color="blue"
                    className="rounded-full hover:bg-blue-600 dark:hover:bg-blur-800 hover:text-white dark:hover:text-gray-200"
                  >
                    تعديل الاشتراك
                  </Button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default SubscriptionsPage;
