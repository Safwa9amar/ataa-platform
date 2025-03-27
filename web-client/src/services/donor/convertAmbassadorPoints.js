import { getCommonHeaders } from "../getCommonHeaders";

const { default: API_ENDPOINTS } = require("@/config/apiEndPoints");

// دالة لاستخدام Axios لاستدعاء API وتحويل النقاط
export default async function convertAmbassadorPoints(userToken) {
  try {
    const response = await axios.post(API_ENDPOINTS.CONVERT_AMBASADOR_POINTS, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(
      "خطأ في تحويل النقاط:",
      error.response ? error.response.data : error.message
    );
    return { success: false, message: error.message };
  }
}
