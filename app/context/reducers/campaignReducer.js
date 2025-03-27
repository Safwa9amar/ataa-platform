import AsyncStorage from "@react-native-async-storage/async-storage";
import validator from "validator";

export const initialState = {
  title: "",
  description: "",
  campaignStatus: "",
  CampaignType: "",
  bankAccount: "",
  numOfBeneficiaries: 0,
  numberOfUnits: 0,
  unitPrice: 0,
  // personal
  email: "",
  name: "",
  phone: "",
  createdByuserId: "",
  // payout owner if different
  ownerAddress: "",
  ownerEmail: "",
  ownerPhone: "",
  ownerID: "",
  ownerName: "",
  // ongoing
  fieldId: null,
  categoryId: null,
  // blood
  bloodBankName: "",
  selectedBloodType: "",
  googleMapLink: "",
  // target amount
  targetAmount: 0,
  // address
  wilaya: "",
  commune: "",
  daira: "",
  images: [],
  // proof
  proofFiles: [],
  isAgreed: false,
  message: "",
  // auth
};

export const campaignReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return { ...state, [action.payload.key]: action.payload.value };
    case "REPLACE":
      return { ...action.payload };
    case "DELETE":
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    case "UPDATE":
      return { ...state, [action.payload.key]: action.payload.value };
    case "LOAD":
      return { ...state, ...action.payload };
    case "RESET":
      AsyncStorage.removeItem("campaignData");
      return initialState;

    case "SET_TOKEN":
      return { ...state, token: action.payload };
    case "SET_ERROR" || "SET_SUCCESS":
      return { ...state, message: action.payload };
    default:
      return state;
  }
};
