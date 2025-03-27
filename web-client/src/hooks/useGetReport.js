import { useState } from "react";
import { getCommonHeaders } from "../services/getCommonHeaders";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { useCredentials } from "../context/CredentialsContext";

export const useGetReport = (URI, fileName) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const path = `${RNFS.DocumentDirectoryPath}/${fileName}.txt`;

  const { userToken } = useCredentials();

  const getReport = async (from, to) => {
    setLoading(true);
    try {
      const download = RNFS.downloadFile({
        fromUrl: `${URI}/${from}/${to}`,
        toFile: path,
        headers: getCommonHeaders(userToken),
        progressDivider: 1,
        progress: (res) => {
          const progressValue = (res.bytesWritten / res.contentLength) * 100;
          setProgress(Math.round(progressValue));
        },
      });

      const result = await download.promise;
      if (result.statusCode === 200) {
        setFilePath(path);
      } else {
        throw new Error("Download failed");
      }
    } catch (error) {
      console.error("Failed to download user balance report:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openRapport = async () => {
    if (!filePath || progress === null || error || progress < 100) {
      return;
    }
    try {
      await FileViewer.open(path, {
        showAppsSuggestions: true,
        showOpenWithDialog: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // const handleSendEmail = () => {
  //   Mailer.mail(
  //     {
  //       subject: fileName,
  //       recipients: [user.email],
  //       body: `عزيزي المستخدم  ${user.name}
  //       تم ارفاق التقرير المطلوب لك في الرسالة
  //       <p>شكرا لاستخدامكم تطبيقنا</p>
  //       <p>فريق عملنا يتمنى لكم يوما سعيدا</p>
  //       <p>بعطائكم مؤمنون ولنشر الخير ثابتون</p>
  //       `,
  //       isHTML: true,
  //       attachments: [
  //         {
  //           path: path, // The absolute path of the file from which to read data.
  //           uri: "", // The uri of the file from which to read the data.
  //           type: "docx", // Mime Type: jpg, png, doc, ppt, html, pdf, csv
  //           mimeType: "", // - use only if you want to use custom type
  //           name: fileName, // Optional: Custom filename for attachment
  //         },
  //       ],
  //     },
  //     (error, event) => {
  //       Alert.alert(
  //         error,
  //         event,
  //         [
  //           {
  //             text: "Ok",
  //             onPress: () => console.log("OK: Email Error Response"),
  //           },
  //           {
  //             text: "Cancel",
  //             onPress: () => console.log("CANCEL: Email Error Response"),
  //           },
  //         ],
  //         { cancelable: true }
  //       );
  //     }
  //   );
  // };

  return {
    getReport,
    openRapport,
    // handleSendEmail,
    progress,
    loading,
    filePath,
    error,
  };
};
