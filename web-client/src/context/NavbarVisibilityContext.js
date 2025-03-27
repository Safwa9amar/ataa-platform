import React, { createContext, useContext, useState, useEffect } from 'react';

// Step 1: Create the Context
const NavbarVisibilityContext = createContext();

// Step 2: Create a Provider Component
export const NavbarVisibilityProvider = ({ children }) => {
  const [hideNavbar, setHideNavbar] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hideTimeout, setHideTimeout] = useState(null);
  
  // Function to handle scroll events
  const toggleNavbarOnScroll = event => {
    const currentScrollPosition = event.nativeEvent.contentOffset.y;
    setScrollPosition(currentScrollPosition);

    // Show navbar if scroll position is less than or equal to 250
    if (currentScrollPosition <= 250) {
      setHideNavbar(false);
      clearTimeout(hideTimeout);
      return;
    }

    // Clear any existing timeout
    clearTimeout(hideTimeout);

    // Set a timeout to hide the navbar after scrolling stops
    const timeout = setTimeout(() => {
      setHideNavbar(currentScrollPosition > scrollPosition);
    }, 150);

    setHideTimeout(timeout);
  };
  const toggleNavbar = () => setHideNavbar(!hideNavbar);

  // Provide the context value to its children
  return (
    <NavbarVisibilityContext.Provider
      value={{ hideNavbar, setHideNavbar, toggleNavbarOnScroll, toggleNavbar }}
    >
      {children}
    </NavbarVisibilityContext.Provider>
  );
};

// Step 3: Implement a Custom Hook
export const useHideNavbar = () => {
  const context = useContext(NavbarVisibilityContext);
  if (!context) {
    throw new Error('useHideNavbar must be used within a NavbarVisibilityProvider');
  }
  return context;
};
