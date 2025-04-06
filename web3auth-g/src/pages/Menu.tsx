import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import DisconnectWeb3AuthButton from "../components/DisconnectWeb3AuthButton";

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, connect, provider } = useWeb3Auth();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      if (isConnected && provider) {
        try {
          // Cast the provider to 'any' to access getUserInfo method
          const web3authProvider = provider as any;
          const userInfo = await web3authProvider.getUserInfo();
          if (userInfo.email) {
            console.log("User email:", userInfo.email);
            localStorage.setItem('userEmail', userInfo.email);
          }
        } catch (error) {
          console.error("Error getting user info:", error);
        }
      }
      // Définir isLoading à false une fois que la vérification est terminée
      setIsLoading(false);
    };

    getUserInfo();
  }, [isConnected, provider]);

  const handleSignIn = async () => {
    try {
      await connect();
      // After connection, the useEffect will handle getting the user info
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const handleExamsClick = (): void => {
    navigate("/exam_list");
  };

  const handleCertificationsClick = (): void => {
    navigate("/certifications");
  };

  const handleContractClick = (): void => {
    navigate("/contract");
  };

  return (
    <div 
      style={{
        backgroundImage: "url('/img.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "rgba(85, 0, 50, 0.9)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#333333",
        padding: "20px"
      }}
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
        }}
      >
        <h1 
          style={{ 
            marginBottom: "40px", 
            color: "#a80464",
            fontSize: "2.5rem",
            fontWeight: "700"
          }}
        >
          <span style={{color:"rgba(0,0,0,1)"}}>La</span><span style={{ color: "#a80464" }}>Certif</span>
        </h1>
        
        {isLoading ? (
          // Indicateur de chargement pendant la vérification de la connexion
          <div style={{ padding: "20px", textAlign: "center" }}>
            <div
              style={{
                display: "inline-block",
                width: "40px",
                height: "40px",
                border: "4px solid rgba(168, 4, 100, 0.3)",
                borderTop: "4px solid #a80464",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }}
            />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <p style={{ marginTop: "10px", color: "#a80464" }}>Chargement de l'interface...</p>
          </div>
        ) : !isConnected ? (
          <button
            onClick={handleSignIn}
            style={{
              padding: "16px 24px",
              fontSize: "1.2rem",
              fontWeight: "600",
              backgroundColor: "rgba(168, 4, 100, 0.1)",
              color: "#a80464",
              border: "2px solid rgba(168, 4, 100, 0.7)",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 0 10px #a80464, 0 0 15px rgba(168, 4, 100, 0.4)",
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
              e.currentTarget.style.backgroundColor = "rgba(168, 4, 100, 0.2)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 0 15px #a80464, 0 0 20px rgba(168, 4, 100, 0.6)";
            }}
            onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.backgroundColor = "rgba(168, 4, 100, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 0 10px #a80464, 0 0 15px rgba(168, 4, 100, 0.4)";
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
                  backgroundColor: "rgba(168, 4, 100, 0.1)",
                  color: "#a80464",
                  border: "2px solid rgba(168, 4, 100, 0.6)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = "rgba(168, 4, 100, 0.2)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = "rgba(168, 4, 100, 0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
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
                  backgroundColor: "rgba(66, 12, 191, 0.2)",
                  color: "#a80464",
                  border: "2px solid rgba(66, 12, 191, 0.6)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = "rgba(66, 12, 191, 0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = "rgba(66, 12, 191, 0.2)";
                  e.currentTarget.style.transform = "translateY(0)";
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
                <span style={{ color: "rgba(66, 12, 191, 0.9)"}}>Exams</span>
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