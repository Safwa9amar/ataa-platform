import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useCredentials } from "./CredentialsContext";
import { campaignReducer, initialState } from "./reducers/campaignReducer";
import { checkFileType } from "../utils/checkFileType";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import Swal from "sweetalert2";
import axios from "axios";
import API_ENDPOINTS from "@/config/apiEndPoints";

// Create Context
const CreateCampaignContext = createContext();

// Provider Component
export const CreateCampaignProvider = ({ children }) => {
  const AsyncStorage = useAsyncStorage();
  const { user } = useCredentials();
  const [state, dispatch] = useReducer(campaignReducer, initialState);

  // Load campaign state from AsyncStorage on component mount
  useEffect(() => {
    const loadStateFromStorage = async () => {
      try {
        const storedState = await AsyncStorage.getItem("campaignData");

        if (storedState) {
          dispatch({ type: "LOAD", payload: storedState });
        }
      } catch (error) {
        console.error("Failed to load campaign data:", error);
      }
    };

    loadStateFromStorage();
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  // Update campaign with user information when user changes
  useEffect(() => {
    if (user) {
      dispatch({ type: "ADD", payload: { key: "name", value: user.name } });
      dispatch({ type: "ADD", payload: { key: "email", value: user.email } });
    }
  }, [user]);

  // Save campaign state to AsyncStorage whenever it changes
  useEffect(() => {
    const saveStateToStorage = async () => {
      try {
        await AsyncStorage.setItem("campaignData", state);
      } catch (error) {
        console.error("Failed to save campaign data:", error);
      }
    };
    saveStateToStorage();
  }, [state]);

  return (
    <CreateCampaignContext.Provider value={{ state, dispatch }}>
      {children}
    </CreateCampaignContext.Provider>
  );
};

// Custom Hook
export const useCreateCampaign = () => {
  const AsyncStorage = useAsyncStorage();

  const context = useContext(CreateCampaignContext);
  if (!context) {
    throw new Error(
      "useCreateCampaign must be used within a CreateCampaignProvider"
    );
  }

  const { state, dispatch } = context;
  const { user, userToken } = useCredentials();

  const add = (key, value) => {
    dispatch({ type: "ADD", payload: { key, value } });
  };

  const replace = (newData) => {
    dispatch({ type: "REPLACE", payload: newData });
  };

  const update = (key, value) => {
    dispatch({ type: "UPDATE", payload: { key, value } });
  };

  const remove = (key) => {
    dispatch({ type: "DELETE", payload: key });
  };

  const reset = () => {
    if (user) {
      dispatch({ type: "ADD", payload: { key: "name", value: user.name } });
      dispatch({ type: "ADD", payload: { key: "email", value: user.email } });
    }
    dispatch({ type: "RESET" });
  };

  const setToken = (token) => {
    dispatch({ type: "SET_TOKEN", payload: token });
  };

  const load = async () => {
    if (user) {
      dispatch({ type: "ADD", payload: { key: "name", value: user.name } });
      dispatch({ type: "ADD", payload: { key: "email", value: user.email } });
    }
    try {
      const storedState = await AsyncStorage.getItem("campaignData");
      if (storedState) {
        dispatch({ type: "LOAD", payload: JSON.parse(storedState) });
      }
    } catch (error) {
      console.error("Failed to load campaign data:", error);
    }
  };

  const handlePickImages = async (files) => {
    // Ensure at least one file is selected
    if (!files || files.length === 0) {
      Swal.fire({
        icon: "error",
        title: "لم يتم اختيار أي ملف",
        text: "يرجى اختيار صورة للرفع.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      // Show initial upload message
      Swal.fire({
        title: "جاري رفع الصورة...",
        html: `<div className="w-full h-[20px] rounded-md relative">
                 <span id="upload-progress">0%</span>
               </div>`,

        showConfirmButton: false,
        allowOutsideClick: false,
      });

      // Upload file and handle progress
      const res = await axios.post(API_ENDPOINTS.FILES.FILE_UPLOAD, formData, {
        headers: {
          Authorization: userToken,
        },
        onUploadProgress: (evt) => {
          const progress = (evt.loaded / evt.total) * 100;

          // Update progress bar and percentage
          const progressText = document.getElementById("upload-progress");
          if (progressText) {
            progressText.textContent = `${progress.toFixed(0)}%`;
            progressText.style = `
              display: block;
              width: ${progress.toFixed(0)}%;
              background: #4caf50;
              color: white;
              text-align: center;
              height: 100%;
              line-height: 20px;
              border-radius: 5px;
            `;
          }
        },
      });

      // On successful upload
      Swal.fire({
        icon: "success",
        title: "تم رفع الصورة بنجاح!",
        timer: 2000,
        showConfirmButton: false,
      });

      // Update state with the new image
      update("images", [...state.images, res.data.file]);
    } catch (error) {
      console.error("Image upload error:", error);

      // Display error to user
      Swal.fire({
        icon: "error",
        title: "خطأ أثناء رفع الصورة",
        text:
          error?.response?.data?.message ||
          "حدث خطأ أثناء رفع الصور، يرجى المحاولة مرة أخرى.",
      });
    }
  };
  const handlePickFiles = async (files) => {
    // Ensure at least one file is selected
    if (!files || files.length === 0) {
      Swal.fire({
        icon: "error",
        title: "لم يتم اختيار أي ملف",
        text: "يرجى اختيار ملف للرفع.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      // Show initial feedback to the user
      Swal.fire({
        title: "جاري رفع الملف...",
        html: `<div className="w-full h-[20px] rounded-md relative">
                 <span id="upload-progress">0%</span>
               </div>`,
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      // Upload file and track progress
      const res = await axios.post(API_ENDPOINTS.FILES.FILE_UPLOAD, formData, {
        headers: {
          Authorization: userToken,
        },
        onUploadProgress: (evt) => {
          const progress = (evt.loaded / evt.total) * 100;

          // Update progress bar dynamically
          const progressText = document.getElementById("upload-progress");
          if (progressText) {
            progressText.textContent = `${progress.toFixed(0)}%`;
            progressText.style = `
              display: block;
              width: ${progress.toFixed(0)}%;
              background: #4caf50;
              color: white;
              text-align: center;
              height: 100%;
              line-height: 20px;
              border-radius: 5px;
            `;
          }
        },
      });

      // Success feedback
      Swal.fire({
        icon: "success",
        title: "تم رفع الملف بنجاح!",
        timer: 2000,
        showConfirmButton: false,
      });
      console.log(state.proofFiles);

      // Update state with the newly uploaded file
      update(
        "proofFiles",
        state.proofFiles
          ? [...state.proofFiles, res.data.file]
          : [res.data.file]
      );
    } catch (error) {
      console.error("File upload error:", error);

      // Display error feedback to the user
      Swal.fire({
        icon: "error",
        title: "خطأ أثناء رفع الملف",
        text:
          error?.response?.data?.message ||
          "حدث خطأ أثناء رفع الملفات، يرجى المحاولة مرة أخرى.",
      });
    }
  };

  const deleteImage = (filename) => {
    const newFiles = state.images.filter((file) => file.filename !== filename);
    update("images", newFiles);
  };
  const deleteFile = (filename) => {
    const newFiles = state.proofFiles.filter(
      (file) => file.filename !== filename
    );
    update("proofFiles", newFiles);
  };

  return {
    state,
    add,
    replace,
    update,
    remove,
    reset,
    load,
    handlePickImages,
    handlePickFiles,
    setToken,
    deleteFile,
    deleteImage,
  };
};
