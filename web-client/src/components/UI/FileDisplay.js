import React from "react";
import {
  FaFileAlt,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileArchive,
} from "react-icons/fa";

const FileDisplay = ({ filename, mimetype }) => {
  if (!filename) return null;
  // Map MIME types to icons
  const getIconByMimeType = (mimetype) => {
    switch (true) {
      case mimetype.startsWith("image/"):
        return <FaFileImage className="text-blue-500 text-3xl" />;
      case mimetype === "application/pdf":
        return <FaFilePdf className="text-red-500 text-3xl" />;
      case mimetype === "application/msword" ||
        mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <FaFileWord className="text-blue-700 text-3xl" />;
      case mimetype === "application/vnd.ms-excel" ||
        mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return <FaFileExcel className="text-green-500 text-3xl" />;
      case mimetype.startsWith("application/zip") ||
        mimetype === "application/x-rar-compressed":
        return <FaFileArchive className="text-yellow-500 text-3xl" />;
      default:
        return <FaFileAlt className="text-gray-500 text-3xl" />;
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 border border-borderColor rounded-lg shadow-md bg-mangoBlack">
      {/* Icon based on MIME type */}
      <div>{getIconByMimeType(mimetype)}</div>
      {/* Filename */}
      <p className="text-lg truncate">{filename}</p>
    </div>
  );
};

export default FileDisplay;
