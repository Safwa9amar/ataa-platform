import API_ENDPOINTS from "@/config/apiEndPoints";
import axios from "axios";

const uploadFileService = async (
  files,
  uploadUrl = API_ENDPOINTS.FILES.FILE_UPLOAD
) => {
  const formData = new FormData();
  console.log(files);
  


  Object.values(files).forEach((file) => {
    formData.append("files", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
  });

  try {
    const response = await axios.post(uploadUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-App-Request": process.env.X_APP_REQUEST_ID,
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${progress}%`);
        // You can use this to update progress in state if needed
        // For example,
        // dispatch({ type: "UPDATE_PROGRESS", payload: { fileName: file.fileName, progress } });
      },
    });

    console.log("Files uploaded successfully:", response.data);
    return response.data.file; // return the response data for further processing
  } catch (error) {
    console.error("Error uploading files:", error.message);
    throw error; // Re-throw the error to handle it in the calling function
  } finally {
    // Any cleanup if needed
  }
};

export default uploadFileService;
