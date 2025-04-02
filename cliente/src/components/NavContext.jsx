import React, { createContext, useState } from "react";

export const NavContext = createContext();

export const NavProvider = ({ children }) => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

  return (
    <NavContext.Provider value={{ isMenuCollapsed, setIsMenuCollapsed }}>
      {children}
    </NavContext.Provider>
  );
};