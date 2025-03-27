"use client";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input, Button, Typography, Alert } from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import { getCommonHeaders } from "@/services/getCommonHeaders";

const RSwal = withReactContent(Swal);

const useUpdateAddressForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm();
  const { user, userToken, checkAuthentication } = useCredentials();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (data) => {
      setIsSubmitting(true);
      try {
        // Send the updated address to the backend
        await axios.put(
          API_ENDPOINTS.USERS.UPDATE + "/adress/" + user.id,
          {
            age: data.age,
            address: {
              street: data.street,
              city: data.city,
              state: data.state,
              postalCode: data.zipCode,
              country: data.country,
            },
          },
          {
            headers: getCommonHeaders(userToken),
          }
        );
        checkAuthentication(userToken);
        await Swal.fire("", "تم تحديث العنوان بنجاح.", "success");
        // Reset the form
        reset();
        // Close the SweetAlert2 modal
        RSwal.close();
      } catch (error) {
        // Handle errors from the API
        if (error.response) {
          const { data } = error.response;
          setError("root", { type: "manual", message: data.message });
        } else {
          setError("root", {
            type: "manual",
            message: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
          });
        }
        // Reopen the SweetAlert2 modal to show errors
        openAddressSwal();
      } finally {
        setIsSubmitting(false);
      }
    },
    [userToken, user]
  );

  const openAddressSwal = () => {
    RSwal.fire({
      title: "الرجاء تحديث المعلومات الشخصية",
      html: (
        <form
          dir="rtl"
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission
            handleSubmit(onSubmit)(e); // Manually handle form submission
          }}
          className="max-w-xl space-y-4 p-6"
        >
          {/* Street Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Input
              label="العنوان"
              {...register("street", { required: "يجب إدخال العنوان" })}
              error={!!errors.street}
            />
            {errors.street && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.street.message}
              </Typography>
            )}
          </motion.div>

          {/* City */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Input
              label="المدينة"
              {...register("city", { required: "يجب إدخال المدينة" })}
              error={!!errors.city}
            />
            {errors.city && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.city.message}
              </Typography>
            )}
          </motion.div>

          {/* State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Input
              label="المنطقة"
              {...register("state", { required: "يجب إدخال المنطقة" })}
              error={!!errors.state}
            />
            {errors.state && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.state.message}
              </Typography>
            )}
          </motion.div>

          {/* Zip Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Input
              label="الرمز البريدي"
              {...register("zipCode", {
                required: "يجب إدخال الرمز البريدي",
                pattern: {
                  value: /^\d{5}(-\d{4})?$/,
                  message: "الرمز البريدي غير صحيح",
                },
              })}
              error={!!errors.zipCode}
            />
            {errors.zipCode && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.zipCode.message}
              </Typography>
            )}
          </motion.div>

          {/* Country */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Input
              label="البلد"
              {...register("country", { required: "يجب إدخال البلد" })}
              error={!!errors.country}
            />
            {errors.country && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.country.message}
              </Typography>
            )}
          </motion.div>

          {/* Age */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10"
          >
            <Input
              label="العمر"
              {...register("age", { required: "يجب ادخال العمر" })}
              error={!!errors.age}
            />
            {errors.age && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.age.message}
              </Typography>
            )}
          </motion.div>

          {/* Root Error Message */}
          {errors.root?.message && (
            <Alert
              color="red"
              onClose={() => setError("root", { type: "manual", message: "" })}
              variant="gradient"
            >
              {errors.root.message}
            </Alert>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button
              type="submit"
              fullWidth
              color="teal"
              variant="outlined"
              className="mt-6 bg-green-800 hover:bg-green-900"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جاري التحديث..." : "تحديث العنوان"}
            </Button>
          </motion.div>
        </form>
      ),
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false, // Hide the default SweetAlert2 buttons
    });
  };

  return openAddressSwal;
};

export default useUpdateAddressForm;
