// Helper function to get common headers with token
export const getCommonHeaders = (
  userToken,
  Content_Type = "application/json",
  headers
) => {
  return {
    "Content-Type": Content_Type,
    Authorization: userToken || "",
    "X-App-Request": process.env.X_APP_REQUEST_ID,
    ...headers,
  };
};
