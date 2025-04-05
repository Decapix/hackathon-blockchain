import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import QRCode from "react-qr-code";

interface StyleObject {
  [key: string]: string | number | StyleObject;
}

const Certifications: React.FC = () => {
  const navigate = useNavigate();
  const [zoomedQR, setZoomedQR] = useState<string | null>(null);

  const handleBackClick = (): void => {
    navigate("/menu");
  };

  const handleQRCodeClick = (url: string): void => {
    setZoomedQR(url);
  };

  const closeZoomedQR = (): void => {
    setZoomedQR(null);
  };

  return (
    <div 
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#e0e0e0",
        padding: "20px"
      } as React.CSSProperties}
    >
      <div 
        style={{
          maxWidth: "800px",
          width: "100%",
          background: "linear-gradient(145deg, #1e1e1e, #2d2d2d)",
          borderRadius: "15px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          padding: "40px",
          textAlign: "center"
        } as React.CSSProperties}
      >
        <h1 
          style={{ 
            marginBottom: "40px", 
            color: "#6a98f0",
            fontSize: "2.5rem",
            fontWeight: "700"
          } as React.CSSProperties}
        >
          Your <span style={{ color: "#00c3ff" }}>Certifications</span>
        </h1>
        
        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            background: "rgba(255, 255, 255, 0.05)",
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
                background: "rgba(106, 152, 240, 0.1)",
                border: "1px solid rgba(106, 152, 240, 0.3)"
              } as React.CSSProperties}
            >
              <div style={{ textAlign: "left" }}>
                <h3 style={{ margin: "0", color: "#00c3ff" }}>Blockchain Developer</h3>
                <p style={{ margin: "5px 0 0", fontSize: "0.9rem", opacity: "0.7" }}>Issued on March 12, 2025</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div
                  style={{
                    backgroundColor: "#00c3ff20",
                    color: "#00c3ff",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontSize: "0.8rem",
                    fontWeight: "bold"
                  } as React.CSSProperties}
                >
                  Verified
                </div>
                <div 
                  style={{ 
                    backgroundColor: "white", 
                    padding: "5px", 
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                  onClick={() => handleQRCodeClick("http://pasdelien.com")}
                >
                  <QRCode value="http://pasdelien.com" size={50} />
                </div>
              </div>
            </div>
            
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px",
                borderRadius: "8px",
                background: "rgba(106, 152, 240, 0.1)",
                border: "1px solid rgba(106, 152, 240, 0.3)"
              } as React.CSSProperties}
            >
              <div style={{ textAlign: "left" }}>
                <h3 style={{ margin: "0", color: "#00c3ff" }}>Smart Contracts Expert</h3>
                <p style={{ margin: "5px 0 0", fontSize: "0.9rem", opacity: "0.7" }}>Issued on January 27, 2025</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div
                  style={{
                    backgroundColor: "#00c3ff20",
                    color: "#00c3ff",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontSize: "0.8rem",
                    fontWeight: "bold"
                  } as React.CSSProperties}
                >
                  Verified
                </div>
                <div 
                  style={{ 
                    backgroundColor: "white", 
                    padding: "5px", 
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                  onClick={() => handleQRCodeClick("http://pasdelien.com")}
                >
                  <QRCode value="http://pasdelien.com" size={50} />
                </div>
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
            backgroundColor: "#2a2d3e",
            color: "#e0e0e0",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            marginTop: "20px"
          } as React.CSSProperties}
          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.backgroundColor = "#3a3f55";
          }}
          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.backgroundColor = "#2a2d3e";
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

      {/* Modal pour afficher le QR code en grand */}
      {zoomedQR && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            cursor: "pointer"
          }}
          onClick={closeZoomedQR}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <QRCode value={zoomedQR} size={250} />
            <p style={{ color: "#121212", fontSize: "16px", textAlign: "center" }}>
              {zoomedQR}
            </p>
            <button
              onClick={closeZoomedQR}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6a98f0",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifications;
