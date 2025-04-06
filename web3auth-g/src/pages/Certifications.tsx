import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

interface StyleObject {
  [key: string]: string | number | StyleObject;
}

const Certifications: React.FC = () => {
  const navigate = useNavigate();

  const handleBackClick = (): void => {
    navigate("/menu");
  };

  return (
    <div 
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#333333",
        padding: "20px"
      } as React.CSSProperties}
    >
      <div 
        style={{
          maxWidth: "800px",
          width: "100%",
          background: "#ffffff",
          borderRadius: "15px",
          boxShadow: "0 8px 32px rgba(168, 4, 100, 0.3)",
          border: "1px solid rgba(168, 4, 100, 0.2)",
          padding: "40px",
          textAlign: "center"
        } as React.CSSProperties}
      >
        <h1 
          style={{ 
            marginBottom: "40px", 
            color: "#a80464",
            fontSize: "2.5rem",
            fontWeight: "700"
          } as React.CSSProperties}
        >
          Your <span style={{ color: "#a80464" }}>Certifications</span>
        </h1>
        
        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            background: "#f8f9fa",
            borderRadius: "10px"
          } as React.CSSProperties}
        >
          <p style={{ marginBottom: "20px" }}>
            Your certifications and diplomas secured by blockchain technology.
          </p>
          
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginTop: "20px"
            } as React.CSSProperties}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px",
                borderRadius: "8px",
                background: "rgba(168, 4, 100, 0.1)",
                border: "1px solid rgba(168, 4, 100, 0.3)"
              } as React.CSSProperties}
            >
              <div style={{ textAlign: "left" }}>
                <h3 style={{ margin: "0", color: "#a80464" }}>Blockchain Developer</h3>
                <p style={{ margin: "5px 0 0", fontSize: "0.9rem", opacity: "0.7" }}>Issued on March 12, 2025</p>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(168, 4, 100, 0.13)",
                  color: "#a80464",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontSize: "0.8rem",
                  fontWeight: "bold"
                } as React.CSSProperties}
              >
                Vérifié
              </div>
            </div>
            
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px",
                borderRadius: "8px",
                background: "rgba(168, 4, 100, 0.1)",
                border: "1px solid rgba(168, 4, 100, 0.3)"
              } as React.CSSProperties}
            >
              <div style={{ textAlign: "left" }}>
                <h3 style={{ margin: "0", color: "#a80464" }}>Smart Contracts Expert</h3>
                <p style={{ margin: "5px 0 0", fontSize: "0.9rem", opacity: "0.7" }}>Issued on January 27, 2025</p>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(168, 4, 100, 0.13)",
                  color: "#a80464",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontSize: "0.8rem",
                  fontWeight: "bold"
                } as React.CSSProperties}
              >
                Vérifié
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleBackClick}
          style={{
            padding: "12px 20px",
            fontSize: "1rem",
            fontWeight: "600",
            backgroundColor: "rgba(168, 4, 100, 0.2)",
            color: "#ffffff",
            border: "1px solid rgba(168, 4, 100, 0.5)",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            marginTop: "20px",
            boxShadow: "0 0 10px rgba(168, 4, 100, 0.2)"
          } as React.CSSProperties}
          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.backgroundColor = "rgba(168, 4, 100, 0.4)";
            e.currentTarget.style.boxShadow = "0 0 15px rgba(168, 4, 100, 0.4)";
          }}
          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.backgroundColor = "rgba(168, 4, 100, 0.2)";
            e.currentTarget.style.boxShadow = "0 0 10px rgba(168, 4, 100, 0.2)";
          }}
        >
          Back to Menu
        </button>

        <div 
          style={{
            marginTop: "40px",
            opacity: "0.7",
            fontSize: "0.9rem"
          }}
        >
          <p>Secured by blockchain technology</p>
          <div 
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              marginTop: "10px"
            } as React.CSSProperties}
          >
            <span>⚡ Bahamut</span>
            <span>🔗 Web3</span>
            <span>🔒 Decentralized</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certifications;
