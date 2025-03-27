"use client";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";

export const DataFetchError = ({ error, onRetry }) => (
  <div className="w-full p-8 text-center">
    <div className="w-full mx-auto bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-100 dark:border-red-800/60">
      <div className="flex flex-col items-center gap-4">
        {/* Icon */}
        <ExclamationTriangleIcon className="w-12 h-12 text-red-500 dark:text-red-400" />

        {/* Error Message */}
        <div className="space-y-2">
          <h3 className="text-red-600 dark:text-red-200 font-semibold text-lg">
            خطأ في تحميل البيانات
          </h3>
          <p className="text-red-500 dark:text-red-300 text-sm">{error}</p>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <Button
            color="red"
            variant="filled"
            className="mt-4 flex items-center gap-2"
            onClick={onRetry}
          >
            <span>إعادة المحاولة</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </Button>
        )}
      </div>
    </div>
  </div>
);
