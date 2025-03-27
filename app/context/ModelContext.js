import React, {createContext, useContext, useState} from 'react';

// Step 1: Create the Context
const ModelContext = createContext();

// Step 2: Implement the Provider
export const ModelProvider = ({children, Model}) => {
  const [isModelOpen, setIsModelOpen] = useState(false);

  const openModel = () => {
    setIsModelOpen(true);
    // Model.current.openModel();
  };

  const closeModel = () => {
    setIsModelOpen(false);
    // Model.current.closeModel();
  };

  return (
    <ModelContext.Provider value={{isModelOpen, openModel, closeModel}}>
      {children}
    </ModelContext.Provider>
  );
};

// Step 3: Implement the Hook
export const useIsModelOpen = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useIsModelOpen must be used within a ModelProvider');
  }
  return context;
};
