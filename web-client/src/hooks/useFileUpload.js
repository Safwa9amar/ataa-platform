import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import { toast } from "react-toastify";

const useFileUpload = () => {
  const { userToken } = useCredentials();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(true);

  const uploadFile = async (files) => {
    // Ensure at least one file is selected
    if (!files || files.length === 0) {
      toast.error("لم يتم اختيار أي ملف. يرجى اختيار صورة للرفع.");
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      setLoading(true);
      setError(null);
      // Show initial upload message
      if (showToast) {
        toast.info("جاري رفع الصورة...", {
          autoClose: uploadedFile,
        });
      }

      const res = await axios.post(API_ENDPOINTS.FILES.FILE_UPLOAD, formData, {
        headers: {
          Authorization: userToken,
        },
        onUploadProgress: (evt) => {
          const progress = Math.round((evt.loaded / evt.total) * 100);
          setUploadProgress(progress);
          const progressBar = document.getElementById("upload-progress");
          if (progressBar) progressBar.style.width = `${progress}%`;
        },
      });
      setUploadedFile(res.data.file);

      // On successful upload
      if (showToast) {
        toast.success("تم رفع الصورة بنجاح!", {
          autoClose: 2000,
          toastId: v4(),
        });
      }
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
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadFile,
    uploadedFile,
    uploadProgress,
    loading,
    error,
    setShowToast,
  };
};

export default useFileUpload;
