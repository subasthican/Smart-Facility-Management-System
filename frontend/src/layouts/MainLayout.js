import React from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      {!isHome && <Navbar />}
      <div style={{ padding: isHome ? "0" : "20px" }}>
        {children}
      </div>
    </>
  );
};

export default MainLayout;