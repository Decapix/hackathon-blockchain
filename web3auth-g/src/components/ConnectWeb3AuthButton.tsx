import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React from "react";

import web3AuthLogoWhite from "../assets/web3authLogoWhite.svg";

const ConnectWeb3AuthButton = () => {
  const { isConnected, connect } = useWeb3Auth();

  if (isConnected) {
    return null;
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        margin: "20px auto"
      }}
    >
      <button
        onClick={connect}
        style={{
          padding: "16px 24px",
          fontSize: "1.2rem",
          fontWeight: "600",
          backgroundColor: "#FF66B2",
          color: "white",
          border: "none",
          borderRadius: "100px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(255, 102, 178, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          minWidth: "250px"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#FF3399";
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 102, 178, 0.4)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#FF66B2";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 102, 178, 0.3)";
        }}
      >
        <img src={web3AuthLogoWhite} style={{ height: "24px", marginRight: "10px" }} />
        Se connecter à La Certif
      </button>
    </div>
  );
};
export default ConnectWeb3AuthButton;
