export const processImageUrlToBase64 = async (url, filename) => {
  try {
    // Fetch the image data from the URL
    const response = await fetch(url);
    const blob = await response.blob();

    // Convert the blob to Base64
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });

    // Determine the image type from the URL
    const imgType = (() => {
      const match = filename.match(/\.(\w+)$/);
      return match && match[1] ? match[1].toLowerCase() : null;
    })();

    // Determine the correct MIME type
    const mimeType = (() => {
      switch (imgType) {
        case "jpg":
        case "jpeg":
          return "image/jpeg";
        case "png":
          return "image/png";
        case "gif":
          return "image/gif";
        case "bmp":
          return "image/bmp";
        case "webp":
          return "image/webp";
        default:
          return "application/octet-stream"; // Fallback for unknown types
      }
    })();

    // Replace the initial MIME type with the correct one
    const finalBase64Data = base64Data.replace(
      /^data:application\/octet-stream;base64/,
      `data:${mimeType};base64`
    );

    return finalBase64Data;
  } catch (error) {
    console.error("Error processing image URL to Base64:", error);
    throw error;
  }
};
