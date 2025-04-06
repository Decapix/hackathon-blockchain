import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";
import { usePlayground } from "../services/playground";

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
              navigate("/menu");
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
            navigate("/menu");
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
          // Trier les résultats par timestamp décroissant (plus récent en premier)
          const sortedData = [...response.data].sort((a, b) => {
            // Convertir en nombre si c'est une chaîne
            const timestampA = typeof a.timestamp === 'string' ? parseInt(a.timestamp, 10) : a.timestamp;
            const timestampB = typeof b.timestamp === 'string' ? parseInt(b.timestamp, 10) : b.timestamp;
            // Tri décroissant (du plus récent au plus ancien)
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

  const handleBackClick = (): void => {
    navigate("/menu");
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
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Loading your certifications...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#ff6b6b' }}>
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
                    background: "rgba(106, 152, 240, 0.1)",
                    border: "1px solid rgba(106, 152, 240, 0.3)"
                  } as React.CSSProperties}
                >
                  <div style={{ textAlign: "left" }}>
                    <h3 style={{ margin: "0", color: "#00c3ff" }}>{cert.exam_id}</h3>
                    <p style={{ margin: "5px 0 0", fontSize: "0.9rem", opacity: "0.7" }}>
                      Issued on {formatDate(cert.timestamp)}
                    </p>
                  </div>
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
                    Vérifié
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
    </div>
  );
};

export default Certifications;
