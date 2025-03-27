import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCredentials } from "./CredentialsContext";
import { campaignReducer, initialState } from "./reducers/campaignReducer";
import { checkFileType } from "../utils/checkFileType";
import { pick, types } from "react-native-document-picker";
import axios from "axios";
import API_ENDPOINTS from "../config/config";
import { getCommonHeaders } from "../services/getCommonHeaders";
// Create Context
const CreateCampaignContext = createContext();

// Provider Component
export const CreateCampaignProvider = ({ children }) => {
  const { user } = useCredentials();
  const [state, dispatch] = useReducer(campaignReducer, initialState);

  // Load campaign state from AsyncStorage on component mount
  useEffect(() => {
    const loadStateFromStorage = async () => {
      try {
        const storedState = await AsyncStorage.getItem("campaignData");
        if (storedState) {
          dispatch({ type: "LOAD", payload: JSON.parse(storedState) });
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
      dispatch({
        type: "UPDATE",
        payload: { key: "createdByuserId", value: parseInt(user.id) },
      });
      dispatch({ type: "ADD", payload: { key: "name", value: user.name } });
      dispatch({ type: "ADD", payload: { key: "email", value: user.email } });
    }
    console.log("User changed:", state.createdByuserId);
  }, [user]);

  // Save campaign state to AsyncStorage whenever it changes
  useEffect(() => {
    const saveStateToStorage = async () => {
      try {
        await AsyncStorage.setItem("campaignData", JSON.stringify(state));
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
  const context = useContext(CreateCampaignContext);
  const { userToken } = useCredentials();
  if (!context) {
    throw new Error(
      "useCreateCampaign must be used within a CreateCampaignProvider"
    );
  }

  const { state, dispatch } = context;
  const { user } = useCredentials();

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
      dispatch({
        type: "ADD",
        payload: { key: "createdByuserId", value: parseInt(user.id) },
      });
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
      dispatch({
        type: "ADD",
        payload: { key: "createdByuserId", value: parseInt(user.id) },
      });
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

  const pickImages = async (
    allowedFiles = [
      types.images,
      types.pdf,
      types.video,
      types.doc,
      types.docx,
    ],
    maxFileSize = 4000000 // 4MB in bytes
  ) => {
    const octToMega = (oct) => Math.floor((oct / 1024 / 1024) * 100) / 100;

    try {
      // Allow only one file to be selected
      const files = await pick({
        allowMultiSelection: false, // Ensure only one file is selected
        type: allowedFiles,
      });

      if (!files || files.length === 0) {
        throw new Error("لم يتم اختيار أي ملف");
      }

      const file = files[0]; // Get the first (and only) file

      // Check file size
      if (file.size > maxFileSize) {
        throw new Error(
          `حجم الملف يتجاوز الحد المسموح به \n الحد الأقصى لحجم الملف هو ${octToMega(
            maxFileSize
          )} ميجا`
        );
      }

      // Prepare file data
      const fileData = {
        name: file.name,
        uri: file.uri,
        type: file.type,
        icon: checkFileType(file), // Assuming `checkFileType` is a function to determine the file type icon
        size: file.size,
      };
      // Check if the file is already selected
      if (
        state.images.length > 0 &&
        state.images.some((f) => f.name === fileData.name)
      ) {
        throw new Error("الملف موجود بالفعل");
      }

      // Prepare FormData for upload
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });

      // Upload file to the server
      const res = await axios.post(API_ENDPOINTS.FILES.FILE_UPLOAD, formData, {
        headers: {
          ...getCommonHeaders(userToken, "multipart/form-data"),
        },
        onUploadProgress: (evt) => {
          const progress = (evt.loaded / evt.total) * 100;
          console.log(`Upload Progress: ${progress}%`);
        },
      });

      console.log("Uploaded file:", res.data.file);

      // Update state with the new file
      update("images", [...state.images, res.data.file]);
    } catch (error) {
      console.error("File picking error:", error.message);
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };
  const pickProofFiles = async (
    allowedFiles = [types.pdf, types.doc, types.docx],
    maxFileSize = 4000000 // 4MB in bytes
  ) => {
    const octToMega = (oct) => Math.floor((oct / 1024 / 1024) * 100) / 100;

    try {
      // Allow only one file to be selected
      const files = await pick({
        allowMultiSelection: false, // Ensure only one file is selected
        type: allowedFiles,
      });

      if (!files || files.length === 0) {
        throw new Error("لم يتم اختيار أي ملف");
      }

      const file = files[0]; // Get the first (and only) file

      // Check file size
      if (file.size > maxFileSize) {
        throw new Error(
          `حجم الملف يتجاوز الحد المسموح به \n الحد الأقصى لحجم الملف هو ${octToMega(
            maxFileSize
          )} ميجا`
        );
      }

      // Prepare file data
      const fileData = {
        name: file.name,
        uri: file.uri,
        type: file.type,
        icon: checkFileType(file), // Assuming `checkFileType` is a function to determine the file type icon
        size: file.size,
      };
      // Check if the file is already selected
      if (
        state.proofFiles.length > 0 &&
        state.proofFiles.some((f) => f.name === fileData.name)
      ) {
        throw new Error("الملف موجود بالفعل");
      }

      // Prepare FormData for upload
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });

      // Upload file to the server
      const res = await axios.post(API_ENDPOINTS.FILES.FILE_UPLOAD, formData, {
        headers: {
          ...getCommonHeaders(userToken, "multipart/form-data"),
        },
        onUploadProgress: (evt) => {
          const progress = (evt.loaded / evt.total) * 100;
          console.log(`Upload Progress: ${progress}%`);
        },
      });

      console.log("Uploaded file:", res.data.file);

      // Update state with the new file
      update("proofFiles", [...state.proofFiles, res.data.file]);
    } catch (error) {
      console.error("File picking error:", error.message);
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const deleteFile = (fileName) => {
    const newFiles = state.images.filter((file) => file.fileName !== fileName);
    update("images", newFiles);
  };

  return {
    state,
    add,
    replace,
    update,
    remove,
    reset,
    load,
    setToken,
    pickImages,
    pickProofFiles,
    deleteFile,
  };
};
