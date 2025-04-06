import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";
import { usePlayground } from "../services/playground";
import QRCode from "react-qr-code";

interface StyleObject {
  [key: string]: string | number | StyleObject;
}

interface Certification {
  exam_id: string;
  email: string;
  timestamp: string;
  is_verified?: boolean;
  [key: string]: any; // For any other fields that might be returned
}

const Certifications: React.FC = () => {
  const navigate = useNavigate();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getUserInfo } = usePlayground();

  useEffect(() => {
    // Function to get user information
    const fetchUserInfo = async () => {
      try {
        // Get user info from Playground context
        const userInfo = await getUserInfo();
        console.log("Playground userInfo:", userInfo);

        if (userInfo && userInfo.email) {
          console.log("Email found in Playground:", userInfo.email);
          setUserEmail(userInfo.email);
          localStorage.setItem('userEmail', userInfo.email);
        } else {
          // Fallback: try from localStorage
          const storedEmail = localStorage.getItem('userEmail');
          if (storedEmail) {
            console.log("Email found in localStorage:", storedEmail);
            setUserEmail(storedEmail);
          } else {
            // Last resort: ask the user
            const emailInput = prompt("Please enter your email address to continue:");
            if (emailInput) {
              console.log("Email manually entered:", emailInput);
              setUserEmail(emailInput);
              localStorage.setItem('userEmail', emailInput);
            } else {
              console.error("No email provided");
              alert("An email is required to continue. You will be redirected to the menu.");
              navigate("/");
            }
          }
        }
      } catch (error) {
        console.error("Error retrieving user information:", error);
        // Fallback in case of error
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
          console.log("Email found in localStorage after error:", storedEmail);
          setUserEmail(storedEmail);
        } else {
          // Last resort: ask the user
          const emailInput = prompt("Please enter your email address to continue:");
          if (emailInput) {
            console.log("Email manually entered after error:", emailInput);
            setUserEmail(emailInput);
            localStorage.setItem('userEmail', emailInput);
          } else {
            console.error("No email provided after error");
            alert("An email is required to continue. You will be redirected to the menu.");
            navigate("/");
          }
        }
      }
    };

    fetchUserInfo();
  }, [getUserInfo, navigate]);

  useEffect(() => {
    // Only fetch certifications if we have the user's email
    if (userEmail) {
      const fetchCertifications = async () => {
        try {
          setLoading(true);
          setError(null);
          // Make API call to the backend to get certification results
          console.log(`Fetching certifications for user: ${userEmail}`);

          // Use the same base URL that other components are successfully using (port 8502 instead of 5000)
          const API_BASE_URL = "http://localhost:8502";
          console.log(`Making request to: ${API_BASE_URL}/get_result?email=${userEmail}`);

          // Add a timestamp to prevent caching issues
          const response = await axios.get(`${API_BASE_URL}/get_result`, {
            params: {
              email: userEmail,
              _t: new Date().getTime() // Cache-busting parameter
            },
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            // Increase timeout for slower connections
            timeout: 10000
          });

          console.log('Certification data received:', response.data);
          // Sort the results by timestamp in descending order (most recent first)
          const sortedData = [...response.data].sort((a, b) => {
            // Convert to number if it's a string
            const timestampA = typeof a.timestamp === 'string' ? parseInt(a.timestamp, 10) : a.timestamp;
            const timestampB = typeof b.timestamp === 'string' ? parseInt(b.timestamp, 10) : b.timestamp;
            // Descending sort (most recent first)
            return timestampB - timestampA;
          });
          setCertifications(sortedData);
        } catch (error) {
          console.error("Error fetching certifications:", error);
          setError("Failed to load certifications. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchCertifications();
    }
  }, [userEmail]);
  const [zoomedQR, setZoomedQR] = useState<string | null>(null);

  const handleBackClick = (): void => {
    navigate("/");
  };

  // Format date string to include both date and time
  const formatDate = (timestamp: number | string | undefined) => {
    try {
      // Si timestamp est undefined ou null, retourner un message par défaut
      if (timestamp === undefined || timestamp === null) {
        console.error("Missing timestamp value");
        return "Date unavailable";
      }

      // Convertir en nombre si c'est une chaîne
      const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;

      if (isNaN(timestampNum)) {
        console.error("Invalid timestamp value:", timestamp);
        return "Invalid date format";
      }

      // Convertir les secondes en millisecondes pour JavaScript Date
      const date = new Date(timestampNum * 1000);

      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        console.error("Created invalid date object from timestamp:", timestampNum);
        return "Invalid date";
      }

      // Formatage de la date avec jour, mois, année
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Formatage de l'heure au format 24h
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      // Combiner date et heure
      return `${dateStr} at ${timeStr}`;
    } catch (e) {
      console.error("Error formatting date:", e, timestamp);
      return "Error processing date";
    }
  };

  const handleQRCodeClick = (url: string): void => {
    setZoomedQR(url);
  };

  const closeZoomedQR = (): void => {
    setZoomedQR(null);
  };

  // Nouvelle fonction pour générer et télécharger un PDF vide
  const downloadEmptyPDF = (): void => {
    // Création d'un élément temporaire pour le téléchargement
    const link = document.createElement('a');
    
    // URL du PDF vide (un blob vide avec le type MIME pour PDF)
    const file = new Blob([' '], { type: 'application/pdf' });
    
    // Création d'une URL object pour le blob
    const fileURL = URL.createObjectURL(file);
    
    // Configuration de l'élément pour le téléchargement
    link.href = fileURL;
    link.download = `certification-${zoomedQR}.pdf`;
    
    // Ajout temporaire au DOM pour déclencher le téléchargement
    document.body.appendChild(link);
    link.click();
    
    // Nettoyage
    document.body.removeChild(link);
    URL.revokeObjectURL(fileURL);
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
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Loading your certifications...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#a80464' }}>
              <p>{error}</p>
            </div>
          ) : certifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>You don't have any certifications yet.</p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                marginTop: "20px"
              } as React.CSSProperties}
            >
              {certifications.map((cert, index) => (
                <div
                  key={index}
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
                  <h3 style={{ margin: "0", color: "#a80464" }}>{cert.exam_id}</h3>
                  <p style={{ margin: "5px 0 0", fontSize: "0.9rem", opacity: "0.7" }}>
                    Issued on {formatDate(cert.timestamp)}
                  </p>
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
                Verified
                </div>
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "5px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleQRCodeClick(cert.exam_id)}
                >
                <QRCode value="https://example.com" size={50} />
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={handleBackClick}
          style={{
            padding: "12px 20px",
            fontSize: "1rem",
            fontWeight: "600",
            backgroundColor: "rgba(168, 4, 100, 1)",
            color: "#ffffff",
            border: "1px solid rgba(168, 4, 100, 0.5)",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            marginTop: "20px",
            boxShadow: "0 0 10px rgba(168, 4, 100, 0.2)"
          } as React.CSSProperties}
          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.backgroundColor = "rgba(168, 4, 100, 1)";
            e.currentTarget.style.boxShadow = "0 0 15px rgba(168, 4, 100, 1)";
          }}
          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.backgroundColor = "rgba(168, 4, 100, 1)";
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
              boxShadow: "0 0 20px rgba(168, 4, 100, 0.5)",
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
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={closeZoomedQR}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#a80464",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Close
              </button>
              <button
                onClick={downloadEmptyPDF}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Télécharger PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifications;