export const initialState = {
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
      localStorage.removeItem("campaignData");
      return initialState;

    case "SET_TOKEN":
      return { ...state, token: action.payload };
    case "SET_ERROR" || "SET_SUCCESS":
      return { ...state, message: action.payload };
    default:
      return state;
  }
};
