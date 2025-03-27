import React, { createContext, useContext, useState } from "react";

// Step 1: Create the Context
const DrawerContext = createContext();

// Step 2: Implement the Provider
export const DrawerProvider = ({ children, drawer }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => {
    setIsDrawerOpen(true);
    drawer.current.openDrawer();
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    drawer.current.closeDrawer();
  };

  const toggleDrawer = () => {
    console.log(isDrawerOpen);

    isDrawerOpen ? closeDrawer() : openDrawer();
  };

  return (
    <DrawerContext.Provider
      value={{ isDrawerOpen, openDrawer, closeDrawer, toggleDrawer }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

// Step 3: Implement the Hook
export const useIsDrawerOpen = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useIsDrawerOpen must be used within a DrawerProvider");
  }
  return context;
};
