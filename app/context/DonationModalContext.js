import React, { createContext, useState, useContext } from "react";

const DonationModalContext = createContext();

export const useDonationModalContext = () => useContext(DonationModalContext);

export const DonationModalProvider = ({ children }) => {
  const [showDonationModal, setShowDonationModal] = useState(false);

  const toggleDonationModal = () => {
    setShowDonationModal((prev) => !prev);
  };

  const closeDonationModal = () => {
    setShowDonationModal(false);
  };

  const contextValue = {
    showDonationModal,
    toggleDonationModal,
    closeDonationModal,
  };

  return (
    <DonationModalContext.Provider value={contextValue}>
      {children}
    </DonationModalContext.Provider>
  );
};
