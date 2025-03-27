import { useReducer, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { checkFileType } from "../utils/checkFileType";
import API_ENDPOINTS from "../config/config";
import { useCredentials } from "../context/CredentialsContext";
import { Platform } from "react-native";

let types = {};
Platform.OS === "web"
  ? (types = { images: "image", videos: "video", files: "file" })
  : (types = {
      images: "public.image",
      videos: "public.movie",
      files: "public.data",
    });
let pick = () => {};
if (Platform.OS !== "web") {
  pick = require("react-native-document-picker").default;
}

const initialState = {
  filesData: [],
  maxSize: 0,
  loading: false,
  message: "",
  error: "",
};

const fileUploadReducer = (state, action) => {
  switch (action.type) {
    case "ADD_FILES":
      return {
        ...state,
        filesData: [...state.filesData, ...action.payload],
      };
    case "REMOVE_FILE":
      return {
        ...state,
        filesData: state.filesData.filter(
          (file) => file.fileName !== action.payload
        ),
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_MESSAGE":
      return {
        ...state,
        message: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "UPDATE_PROGRESS":
      return {
        ...state,
        filesData: state.filesData.map((file) =>
          file.fileName === action.payload.fileName
            ? { ...file, progress: action.payload.progress }
            : file
        ),
      };

    case "ADD_UPLOADED_FILE_NAME":
      return {
        ...state,
        filesData: state.filesData.map((file) => {
          return { ...file, newFileName: action.payload.newFileName };
        }),
      };

    case "UPDATE_MAX_SIZE":
      return {
        ...state,
        maxSize: action.payload,
      };
    default:
      return state;
  }
};

const useFileUpload = (maxFileSize = 20000000, uploadUrl) => {
  const { userToken } = useCredentials();
  const [state, dispatch] = useReducer(fileUploadReducer, initialState);
  const uploadedFiles = useRef([]); // Track already uploaded files

  const pickFiles = useCallback(
    async (
      allowedFiles = [
        types.images,
        types.pdf,
        types.video,
        types.doc,
        types.docx,
      ]
    ) => {
      try {
        const files = await pick({
          allowMultiSelection: false,
          type: allowedFiles,
        });

        const newFiles = files.map((file) => ({
          fileName: file.name,
          uri: file.uri,
          type: file.type,
          icon: checkFileType(file),
          size: file.size,
          progress: 0,
        }));

        newFiles.forEach((file) => {
          if (state.maxSize + file.size > maxFileSize) {
            dispatch({
              type: "SET_ERROR",
              payload: "الحد الاقصى للملفات \n لا يجب ان يتجاوز 20 ميجا",
            });
            return;
          }

          // Check if file already selected
          if (state.filesData.some((f) => f.fileName === file.fileName)) {
            dispatch({ type: "SET_ERROR", payload: "الملف موجود بالفعل" });
            return;
          }

          dispatch({ type: "ADD_FILES", payload: [file] });
        });
      } catch (error) {
        console.error("File picking error:", error);
        dispatch({ type: "SET_ERROR", payload: "Error picking files." });
      }
    },
    [state.filesData, state.maxSize, maxFileSize]
  );

  const uploadFile = useCallback(
    async (file) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_MESSAGE", payload: "" });
      dispatch({ type: "SET_ERROR", payload: "" });

      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.fileName,
        type: file.type,
      });

      try {
        const response = await axios.post(
          uploadUrl ? uploadUrl : API_ENDPOINTS.FILES.FILE_UPLOAD,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const progress = progressEvent.loaded / progressEvent.total;
              dispatch({
                type: "UPDATE_PROGRESS",
                payload: { fileName: file.fileName, progress },
              });
            },
          }
        );

        const uploadedFileInfo = response.data;
        dispatch({
          type: "SET_MESSAGE",
          payload: "File uploaded successfully!",
        });
        uploadedFiles.current.push({
          ...uploadedFileInfo.file,
          originalname: file.fileName,
        });

        dispatch({
          type: "UPDATE_PROGRESS",
          payload: { fileName: file.fileName, progress: 1 },
        });
        dispatch({
          type: "ADD_UPLOADED_FILE_NAME",
          payload: {
            originalname: uploadedFileInfo.file.originalname,
            newFileName: uploadedFileInfo.file.filename,
          },
        });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Error uploading file." });
        console.error("Error uploading file:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [uploadUrl]
  );

  useEffect(() => {
    state.filesData.forEach((file) => {
      if (
        file.progress === 1 ||
        uploadedFiles.current.some((f) => f.originalname === file.fileName)
      ) {
        console.log("File already uploaded:", file.fileName);
        return;
      }
      uploadFile(file);
    });
    console.log("Files to upload:", state.filesData);
  }, [state.filesData, uploadFile]);

  const deleteFile = useCallback(
    async (fileName) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        const fileToDelete = uploadedFiles.current.find(
          (file) => file.originalname === fileName
        );

        if (!fileToDelete) return;

        const deleteFromServer = await axios.delete(
          uploadUrl
            ? uploadUrl
            : `${API_ENDPOINTS.FILES.DELETE_FILE}/${fileToDelete.filename}`,
          {
            headers: {
              Authorization: userToken,
            },
          }
        );

        if (deleteFromServer.status === 200) {
          uploadedFiles.current = uploadedFiles.current.filter(
            (file) => file.originalname !== fileName
          );
          dispatch({ type: "REMOVE_FILE", payload: fileName });
        }
      } catch (error) {
        console.error("Error deleting file:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [userToken, uploadUrl]
  );

  useEffect(() => {
    const totalSize = state.filesData.reduce((acc, file) => acc + file.size, 0);
    dispatch({ type: "UPDATE_MAX_SIZE", payload: totalSize });
  }, [state.filesData]);

  return {
    filesData: state.filesData,
    uploadedFiles: uploadedFiles.current,
    pickFiles,
    deleteFile,
    loading: state.loading,
    message: state.message,
    error: state.error,
  };
};

export default useFileUpload;
