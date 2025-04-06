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
          backgroundColor: "rgba(0, 195, 255, 0.1)",
          color: "#00c3ff",
          border: "2px solid rgba(0, 195, 255, 0.7)",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 0 10px #00c3ff, 0 0 15px rgba(0, 195, 255, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          minWidth: "250px"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(0, 195, 255, 0.2)";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 0 15px #00c3ff, 0 0 20px rgba(0, 195, 255, 0.6)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(0, 195, 255, 0.1)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 0 10px #00c3ff, 0 0 15px rgba(0, 195, 255, 0.4)";
        }}
      >
        <img src={web3AuthLogoWhite} style={{ height: "24px", marginRight: "10px" }} />
        Connect to La Certif
      </button>
    </div>
  );
};
export default ConnectWeb3AuthButton;
