let types = { images: "image", videos: "video", files: "file" };

const checkFileType = (file) => {
  try {
    console.log(file.type === types.images.split("/")[0], "file.type");
    switch (file.type) {
      case types.doc:
      case types.docx:
        return "document-scanner";
      case types.video:
        return "video-library";
      case types.pdf:
        return "picture-as-pdf";
      default:
        return "image/*"; // يمكنك إضافة نوع افتراضي للتعامل مع الأنواع غير المعروفة
    }
  } catch (error) {
    console.error("Failed to check file type:", error.message);
  }
};

const uploadFile = async (url = "YOUR_UPLOAD_ENDPOINT", file, setProgress) => {
  const fileSize = file.size;
  const stream = new ReadableStream({
    start(controller) {
      const reader = file.stream().getReader();
      let uploaded = 0;
      function push() {
        reader.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }
          uploaded += value.length;
          const progress = (uploaded / fileSize) * 100;
          setProgress(progress);
          controller.enqueue(value);
          push();
        });
      }

      push();
    },
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": file.type,
      "X-App-Request": process.env.X_APP_REQUEST_ID,
    },
    body: stream,
  });

  if (response.ok) {
    console.log("File uploaded successfully");
    setProgress(100);
  } else {
    console.error("File upload failed");
  }
};

export { checkFileType, uploadFile };
