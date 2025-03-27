import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints"; // Configure your API endpoints here
import { getCommonHeaders } from "./getCommonHeaders"; // Utility to add common headers like authentication tokens

/**
 * Utility function to handle file downloads.
 * @param {Object} response - The Axios response object containing the file.
 * @param {string} fileName - The desired name for the downloaded file.
 */
const downloadFile = (response, fileName) => {
  const blob = new Blob([response.data], {
    type: response.headers["content-type"],
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Fetch Zakat reports as a DOCX file.
 * @param {string} year - The year of the Zakat report.
 * @param {string} id - The Zakat report ID.
 * @param {string} [from] - Start date for the report (optional).
 * @param {string} [to] - End date for the report (optional).
 * @param {string} userToken - User's authentication token.
 */
export const getZakatRepport = async (year, userToken) => {
  try {
    const url = `${API_ENDPOINTS.REPPORTS.GET_ZAKAT_REPPORT}/${year}`;
    const response = await axios.get(url, {
      headers: getCommonHeaders(userToken),
      responseType: "blob", // Indicate that the response is a binary file
    });
    downloadFile(response, `Zakat_Report_${year}_.docx`);
  } catch (error) {
    console.error("Failed to fetch Zakat report:", error.message);
    throw new Error("Failed to fetch Zakat report.");
  }
};

/**
 * Fetch donation opportunities reports as a DOCX file.
 * @param {string} id - Donation opportunity ID.
 * @param {string} userToken - User's authentication token.
 */
export const getDonationOpportunitiesRepports = async (id, userToken) => {
  try {
    const url = `${API_ENDPOINTS.REPPORTS.GET_DONATION_OPPORTUNITIES_REPPORTS}/${id}`;
    const response = await axios.get(url, {
      headers: getCommonHeaders(userToken),
      responseType: "blob",
    });
    downloadFile(response, `Donation_Opportunities_Report_${id}.docx`);
  } catch (error) {
    console.error(
      "Failed to fetch donation opportunities report:",
      error.message
    );
    throw new Error("Failed to fetch donation opportunities report.");
  }
};

// Similar updates for other report fetching functions

/**
 * Fetch campaigns reports as a DOCX file.
 */
export const getCampaignsRepports = async (id, userToken) => {
  try {
    const url = `${API_ENDPOINTS.REPPORTS.GET_CAMPAIGNS_REPPORTS}/${id}`;
    const response = await axios.get(url, {
      headers: getCommonHeaders(userToken),
      responseType: "blob",
    });
    downloadFile(response, `Campaigns_Report_${id}.docx`);
  } catch (error) {
    console.error("Failed to fetch campaigns report:", error.message);
    throw new Error("Failed to fetch campaigns report.");
  }
};

/**
 * Fetch user balance reports as a DOCX file.
 */
export const getUserBalanceRepports = async (from, to, userToken) => {
  try {
    const url = `${API_ENDPOINTS.REPPORTS.GET_USER_BALANCE_REPPORTS}${
      from ? `/${from}` : ""
    }${to ? `/${to}` : ""}`;
    const response = await axios.get(url, {
      headers: getCommonHeaders(userToken),
      responseType: "blob",
    });
    downloadFile(response, `User_Balance_Report.docx`);
  } catch (error) {
    console.error("Failed to fetch user balance report:", error.message);
    throw new Error("Failed to fetch user balance report.");
  }
};

/**
 * Fetch donations reports as a DOCX file.
 */
export const getDonationsRepports = async (from, to, userToken) => {
  try {
    const url = `${API_ENDPOINTS.REPPORTS.GET_DONATIONS_REPPORTS}${
      from ? `/${from}` : ""
    }${to ? `/${to}` : ""}`;
    const response = await axios.get(url, {
      headers: getCommonHeaders(userToken),
      responseType: "blob",
    });
    downloadFile(response, `Donations_Report.docx`);
  } catch (error) {
    console.error("Failed to fetch donations report:", error.message);
    throw new Error("Failed to fetch donations report.");
  }
};
