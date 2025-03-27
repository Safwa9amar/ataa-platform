"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import {
  getCampaignsByUserId,
  getUsersCampaigns,
} from "../services/campaignServices";

// Initial state
const initialState = {
  campaigns: [],
  currentCampaign: null,
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
};

// Actions
const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_CAMPAIGNS: "SET_CAMPAIGNS",
  APPEND_CAMPAIGNS: "APPEND_CAMPAIGNS",
  SET_HAS_MORE: "SET_HAS_MORE",
  RESET_CAMPAIGNS: "RESET_CAMPAIGNS",
  SET_PAGE: "SET_PAGE",
};

// Reducer
const campaignReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_CAMPAIGNS:
      return {
        ...state,
        campaigns: action.payload,
        loading: false,
        error: null,
      };
    case ACTIONS.APPEND_CAMPAIGNS:
      return {
        ...state,
        campaigns: [
          ...state.campaigns,
          ...action.payload.filter(
            (campaign) =>
              !state.campaigns.some((existing) => existing.id === campaign.id)
          ),
        ],
        loading: false,
        error: null,
      };
    case ACTIONS.SET_HAS_MORE:
      return { ...state, hasMore: action.payload };
    case ACTIONS.RESET_CAMPAIGNS:
      return { ...initialState };
    case ACTIONS.SET_PAGE:
      return { ...state, page: action.payload };
    default:
      return state;
  }
};

// Create Context
const CampaignContext = createContext();

// Provider Component
export const CampaignProvider = ({ children }) => {
  const [state, dispatch] = useReducer(campaignReducer, initialState);

  // Utility: Set loading state
  const setLoading = (isLoading) =>
    dispatch({ type: ACTIONS.SET_LOADING, payload: isLoading });

  // Utility: Set error state
  const setError = (error) =>
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });

  // Reset campaigns to initial state
  const resetCampaigns = () => dispatch({ type: ACTIONS.RESET_CAMPAIGNS });

  // Increment the page
  const nextPage = () =>
    dispatch({ type: ACTIONS.SET_PAGE, payload: state.page + 1 });

  // Fetch campaigns by user ID with pagination
  const fetchCampaignsByUserId = useCallback(
    async (userId, filters, userToken) => {
      try {
        setLoading(true);
        const campaigns = await getCampaignsByUserId(
          userId,
          filters,
          userToken
        );

        if (campaigns.length > 0) {
          dispatch({ type: ACTIONS.APPEND_CAMPAIGNS, payload: campaigns });
        } else {
          dispatch({ type: ACTIONS.SET_HAS_MORE, payload: false });
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch user's campaigns with pagination
  const fetchUsersCampaigns = useCallback(async (filters, userToken) => {
    try {
      setLoading(true);
      const campaigns = await getUsersCampaigns(filters, userToken);

      if (campaigns.length > 0) {
        dispatch({ type: ACTIONS.APPEND_CAMPAIGNS, payload: campaigns });
      } else {
        dispatch({ type: ACTIONS.SET_HAS_MORE, payload: false });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CampaignContext.Provider
      value={{
        ...state,
        nextPage,
        resetCampaigns,
        fetchCampaignsByUserId,
        fetchUsersCampaigns,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

// Custom Hook
export const useCampaigns = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaigns must be used within a CampaignProvider");
  }
  return context;
};
