import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

// 📌 استرجاع كل حملات التبرع بالدم
export const getAllNationalBloodCampaigns = async (wilaya, userToken = "") => {
  try {
    const response = await axios.get(API_ENDPOINTS.NATIONAL_BLOOD.GET_ALL, {
      headers: getCommonHeaders(userToken),
      params: {
        wilaya: wilaya ?? "",
        keywords: "",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("تعذر تحميل حملات التبرع بالدم");
  }
};

export const getMyNationalBloodCampaigns = async (
  status,
  keywords,
  userToken
) => {
  try {
    const response = await axios.get(API_ENDPOINTS.NATIONAL_BLOOD.GET_MY, {
      headers: getCommonHeaders(userToken),
      params: {
        status,
        keywords,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("تعذر تحميل حملات التبرع بالدم");
  }
};

// 📌 استرجاع حملة معينة حسب المعرف
export const getNationalBloodCampaignById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.NATIONAL_BLOOD.GET_BY_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("تعذر استرجاع تفاصيل الحملة");
  }
};

// 📌 إنشاء حملة جديدة
export const createNationalBloodCampaign = async (campaignData, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.NATIONAL_BLOOD.CREATE,
      campaignData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("فشل في إنشاء الحملة، يرجى التأكد من البيانات");
  }
};

// 📌 تعديل حملة حسب المعرف
export const updateNationalBloodCampaign = async (
  id,
  campaignData,
  userToken
) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.NATIONAL_BLOOD.UPDATE}/${id}`,
      campaignData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("تعذر تعديل الحملة");
  }
};

// 📌 حذف حملة حسب المعرف
export const deleteNationalBloodCampaign = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.NATIONAL_BLOOD.DELETE}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("تعذر حذف الحملة");
  }
};
