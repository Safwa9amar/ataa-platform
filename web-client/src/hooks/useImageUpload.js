import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { v4 } from "uuid";
const useImageUpload = (
  apiEndpoint = API_ENDPOINTS.FILES.FILE_UPLOAD,
  userToken = ""
) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showToast, setShowToast] = useState(true);
  const [error, setError] = useState(null);

  const uploadImage = useCallback(
    async (files) => {
      // Ensure at least one file is selected
      if (!files || files.length === 0) {
        toast.error("لم يتم اختيار أي ملف. يرجى اختيار صورة للرفع.");
        return;
      }

      const formData = new FormData();
      formData.append("file", files[0]);

      try {
        setIsUploading(true);
        setError(null);

        // Show initial upload message
        if (showToast) {
          toast.info("جاري رفع الصورة...", {
            autoClose: uploadedFile,
          });
        }

        // Upload file and handle progress
        const res = await axios.post(
          API_ENDPOINTS.FILES.FILE_UPLOAD,
          formData,
          {
            headers: {
              Authorization: userToken,
            },
            onUploadProgress: (evt) => {
              const progress = (evt.loaded / evt.total) * 100;
              setUploadProgress(progress.toFixed(0));

              // Update progress in the toast
              toast.update("upload-progress", {
                toastId: v4(),
                render: `جاري الرفع: ${progress.toFixed(0)}%`,
              });
            },
          }
        );

        // On successful upload
        if (showToast) {
          toast.success("تم رفع الصورة بنجاح!", {
            autoClose: 2000,
            toastId: v4(),
          });
        }

        setUploadedFile(res.data.file);
        return res.data.file;
      } catch (err) {
        console.error("Image upload error:", err);
        const errorMessage =
          err?.response?.data?.message ||
          "حدث خطأ أثناء رفع الصور، يرجى المحاولة مرة أخرى.";
        setError(errorMessage);

        // Display error to user
        if (showToast) {
          toast.error(`خطأ أثناء رفع الصورة: ${errorMessage}`);
        }
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [apiEndpoint, userToken, showToast]
  );

  return {
    setUploadedFile,
    setShowToast,
    isUploading,
    uploadProgress,
    uploadedFile,
    error,
    uploadImage,
  };
};

export default useImageUpload;
