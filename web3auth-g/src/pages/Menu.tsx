import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import DisconnectWeb3AuthButton from "../components/DisconnectWeb3AuthButton";

interface StyleProps {
  [key: string]: string | number;
}

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, connect } = useWeb3Auth();

  const handleSignIn = () => {
    connect().then(() => {
      // Vous pouvez ajouter une redirection ici si nécessaire
    });
  };

  const handleExamsClick = (): void => {
    navigate("/exam_list");
  };

  const handleCertificationsClick = (): void => {
    navigate("/certifications");
  };

  return (
    <div 
      style={{
        backgroundImage: "url('/img.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#121212",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#e0e0e0",
        padding: "20px"
      }}
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
        }}
      >
        <h1 
          style={{ 
            marginBottom: "40px", 
            color: "#6a98f0",
            fontSize: "2.5rem",
            fontWeight: "700"
          }}
        >
          La <span style={{ color: "#00c3ff" }}>Certif</span>
        </h1>
        
        {!isConnected ? (
          <button
            onClick={handleSignIn}
            style={{
              padding: "16px 24px",
              fontSize: "1.2rem",
              fontWeight: "600",
              backgroundColor: "rgba(106, 152, 240, 0.1)",
              color: "#6a98f0", 
              border: "2px solid rgba(106, 152, 240, 0.7)",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 0 10px #6a98f0, 0 0 15px rgba(106, 152, 240, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              marginBottom: "20px",
              width: "100%",
              maxWidth: "400px",
              margin: "0 auto 20px"
            }}
            onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.backgroundColor = "rgba(106, 152, 240, 0.2)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 0 15px #6a98f0, 0 0 20px rgba(106, 152, 240, 0.6)";
            }}
            onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.backgroundColor = "rgba(106, 152, 240, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 0 10px #6a98f0, 0 0 15px rgba(106, 152, 240, 0.4)";
            }}
          >
            <span 
              style={{ 
                marginRight: "10px",
                fontSize: "1.4rem"
              }}
            >
              🔑
            </span>
            Se Connecter
          </button>
        ) : (
          <React.Fragment>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                maxWidth: "400px",
                margin: "0 auto"
              }}
            >
              <button
                onClick={handleCertificationsClick}
                style={{
                  padding: "16px 24px",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  backgroundColor: "rgba(255, 20, 147, 0.1)",
                  color: "#ff1493",
                  border: "2px solid rgba(255, 20, 147, 0.7)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 0 10px #ff1493, 0 0 15px rgba(255, 20, 147, 0.4)", // Effet glow réduit
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 20, 147, 0.2)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 0 15px #ff1493, 0 0 20px rgba(255, 20, 147, 0.6)";
                }}
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 20, 147, 0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 0 10px #ff1493, 0 0 15px rgba(255, 20, 147, 0.4)";
                }}
              >
                <span 
                  style={{ 
                    marginRight: "10px",
                    fontSize: "1.4rem"
                  }}
                >
                  🏆
                </span>
                Certifications
              </button>
              
              <button
                onClick={handleExamsClick}
                style={{
                  padding: "16px 24px",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  backgroundColor: "rgba(0, 255, 0, 0.1)",
                  color: "#00ff00", 
                  border: "2px solid rgba(0, 255, 0, 0.7)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 0 10px #00ff00, 0 0 15px rgba(0, 255, 0, 0.4)", // Effet glow réduit
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 0 15px #00ff00, 0 0 20px rgba(0, 255, 0, 0.6)";
                }}
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = "rgba(0, 255, 0, 0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 0 10px #00ff00, 0 0 15px rgba(0, 255, 0, 0.4)";
                }}
              >
                <span 
                  style={{ 
                    marginRight: "10px",
                    fontSize: "1.4rem"
                  }}
                >
                  📝
                </span>
                Exams
              </button>
            </div>

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
                }}
              >
                <span>⚡ Bahamut</span>
                <span>🔗 Web3</span>
                <span>🔒 Decentralized</span>
              </div>
            </div>
            <div 
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <DisconnectWeb3AuthButton />
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Menu;
