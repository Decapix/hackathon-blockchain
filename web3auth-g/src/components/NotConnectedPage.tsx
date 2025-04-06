import React from "react";

import { usePlayground } from "../services/playground";
import ConnectWeb3AuthButton from "./ConnectWeb3AuthButton";
import SourceCode from "./SourceCode";

const NotConnectedPage = () => {
  const { isLoading } = usePlayground();

  return (
    <div style={{
        backgroundImage: "url('/img5.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#333333",
        padding: "20px"
      }}>
      <h1 style={{ 
        marginBottom: "40px", 
        color: "#FF66B2",
        fontSize: "2.5rem",
        fontWeight: "700",
        textShadow: "0px 2px 4px rgba(0,0,0,0.1)"
      }}>
        Bienvenue sur <span style={{ color: "#FF3399" }}>La Certif</span>
      </h1>
      <div style={{
        maxWidth: "800px",
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(255, 102, 178, 0.2)",
        padding: "40px",
        textAlign: "center",
        border: "1px solid #FFE6F2"
      }}>
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#FF66B2" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="#FF3399"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <ConnectWeb3AuthButton />
        )}
      </div>
      <SourceCode />
    </div>
  );
};
export default NotConnectedPage;
