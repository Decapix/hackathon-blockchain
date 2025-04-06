import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import examData from "../question.json";
import "../App.css";
import axios from "axios";
import { usePlayground } from "../services/playground";
import { deployTestEvaluator, initializeTest, startTest } from "../services/testEvaluator";
interface StyleProps {
  [key: string]: string | number | StyleProps;
}

const ExamList: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [exams, setExams] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();
  const { getUserInfo } = usePlayground();
  const { provider, uiConsole } = usePlayground();

  useEffect(() => {
    // Load the exam data from question.json
    setExams(examData);
  }, []);

  useEffect(() => {
    // Fonction pour obtenir les informations utilisateur
    const fetchUserInfo = async () => {
      try {
        // Récupérer les infos utilisateur depuis le contexte Playground
        const userInfo = await getUserInfo();
        console.log("Playground userInfo:", userInfo);

        if (userInfo && userInfo.email) {
          console.log("Email trouvé dans Playground:", userInfo.email);
          setUserEmail(userInfo.email);
          localStorage.setItem('userEmail', userInfo.email);
        } else {
          // Fallback: essayer directement depuis le localStorage
          const storedEmail = localStorage.getItem('userEmail');
          if (storedEmail) {
            console.log("Email trouvé dans localStorage:", storedEmail);
            setUserEmail(storedEmail);
          } else {
            // Solution de dernier recours: demander à l'utilisateur
            const emailInput = prompt("Veuillez entrer votre adresse email pour continuer:");
            if (emailInput) {
              console.log("Email saisi manuellement:", emailInput);
              setUserEmail(emailInput);
              localStorage.setItem('userEmail', emailInput);
            } else {
              console.error("Aucun email fourni");
              alert("Un email est nécessaire pour continuer. Vous allez être redirigé vers le menu.");
              navigate("/");
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations utilisateur:", error);
        // Fallback en cas d'erreur
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
          console.log("Email trouvé dans localStorage après erreur:", storedEmail);
          setUserEmail(storedEmail);
        } else {
          // Solution de dernier recours: demander à l'utilisateur
          const emailInput = prompt("Veuillez entrer votre adresse email pour continuer:");
          if (emailInput) {
            console.log("Email saisi manuellement après erreur:", emailInput);
            setUserEmail(emailInput);
            localStorage.setItem('userEmail', emailInput);
          } else {
            console.error("Aucun email fourni après erreur");
            alert("Un email est nécessaire pour continuer. Vous allez être redirigé vers le menu.");
            navigate("/");
          }
        }
      }
    };

    fetchUserInfo();
  }, [getUserInfo, navigate]);

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExam(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExam) {
      try {
      console.log(`Entering try`);
      // Use the userEmail state we've already fetched
      if (!userEmail) {
        const errorMsg = "User email not found. Please sign in again.";
        console.error(errorMsg);
        alert(errorMsg);
        navigate("/"); // Redirect to main page to force re-authentication
        return;
      }

      console.log(`Starting exam: ${selectedExam} for user: ${userEmail}`);

      // Make API call to backend to start the exam
      const requestData = {
        email: userEmail,
        exam_id: selectedExam
      };
      console.log('Calling backend API with data:', requestData);

      try {
        // Try different backend URLs in sequence
        const backendUrls = [
          'http://localhost:8502/init_exam',      // Local development (external port is 8502)
        ];

        console.log('Attempting to connect to backend services...');
        let response = null;
        let lastError = null;

        // Try each URL until one works
        for (const url of backendUrls) {
          try {
            console.log(`Trying backend URL: ${url}`);
            response = await axios.post(url, requestData, {
              timeout: 5000 // 5 second timeout
            });
            console.log(`Successfully connected to ${url}`);
            break; // Break the loop if successful
          } catch (err) {
            console.log(`Failed to connect to ${url}:`, err);
            lastError = err;
            // Continue to the next URL
          }
        }

        if (!response) {
          throw lastError || new Error('Failed to connect to any backend service');
        }

        console.log('Exam session started:', response.data);

        if (!response.data || !response.data.session_id) {
          throw new Error('Backend response missing session_id');
        }

        // Store session info in localStorage if needed
        localStorage.setItem('examSessionId', response.data.session_id);
        localStorage.setItem('currentExam', selectedExam);

        // Open Streamlit in a new tab
        window.open('http://localhost:8501/test', '_blank');

        // Redirection vers la page Menu après 1 seconde
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (axiosError) {
        throw axiosError; // Rethrow to be caught by the outer catch
      }
    } catch (error: any) {
      // Get detailed error information
      let errorMessage = "Failed to start exam: ";

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
          errorMessage += "Cannot connect to backend server. Is the server running?";
        } else if (error.response) {
          // The request was made and the server responded with a status code outside of 2xx range
          errorMessage += `Server error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage += "No response from server. Check network connection.";
        } else {
          // Something happened in setting up the request
          errorMessage += error.message || "Unknown network error";
        }
      } else {
        // Not an Axios error
        errorMessage += error.message || "Unknown error";
      }

      console.error("Detailed error starting exam:", error);
      alert(errorMessage);
      }
    }
  };

  const handleBackClick = (): void => {
    navigate("/");
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
            marginBottom: "20px",
            color: "#6a98f0",
            fontSize: "2.5rem",
            fontWeight: "700"
          } as React.CSSProperties}
        >
          List of <span style={{ color: "#00c3ff" }}>Exams</span>
        </h1>

        {userEmail && (
          <div
            style={{
              marginBottom: "20px",
              padding: "8px 15px",
              backgroundColor: "rgba(0, 195, 255, 0.1)",
              borderRadius: "6px",
              border: "1px solid rgba(0, 195, 255, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#e0e0e0"
            } as React.CSSProperties}
          >
            <span style={{ fontSize: "1.1rem", marginRight: "10px" }}>👤</span>
            <span style={{ fontWeight: "500" }}>{userEmail}</span>
          </div>
        )}

        <div
          style={{
            marginBottom: "30px",
            padding: "20px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "10px"
          } as React.CSSProperties}
        >
          <p style={{ marginBottom: "20px" }}>
            Select an exam to start your evaluation.
          </p>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                marginBottom: "20px",
                textAlign: "left"
              } as React.CSSProperties}
            >
              <label
                htmlFor="examSelect"
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#00c3ff",
                  fontWeight: "600"
                } as React.CSSProperties}
              >
                Choose an exam:
              </label>
              <select
                id="examSelect"
                value={selectedExam}
                onChange={handleExamChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  color: "#e0e0e0",
                  border: "1px solid rgba(106, 152, 240, 0.3)",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease"
                } as React.CSSProperties}
              >
                <option value="" style={{ backgroundColor: "#1e1e1e" }}>-- Choose an exam --</option>
                {exams.map((exam, index) => (
                  <option key={index} value={exam} style={{ backgroundColor: "#1e1e1e" }}>
                    {exam}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "15px",
                marginTop: "25px"
              } as React.CSSProperties}
            >
              <button
                type="button"
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
                  transition: "all 0.3s ease"
                } as React.CSSProperties}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = "#3a3f55";
                }}
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor = "#2a2d3e";
                }}
              >
                Back
              </button>

              <button
                type="submit"
                disabled={!selectedExam}
                style={{
                  padding: "12px 20px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  backgroundColor: (selectedExam && !loading) ? "#00c3ff" : "#2a2d3e",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: (selectedExam && !loading) ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                  boxShadow: (selectedExam && !loading) ? "0 0 10px rgba(0, 195, 255, 0.4)" : "none",
                  opacity: (selectedExam && !loading) ? "1" : "0.6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                } as React.CSSProperties}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if(selectedExam && !loading) {
                    e.currentTarget.style.backgroundColor = "#33ceff";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 195, 255, 0.5)";
                  }
                }}
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if(selectedExam && !loading) {
                    e.currentTarget.style.backgroundColor = "#00c3ff";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 195, 255, 0.4)";
                  }
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Initializing on Blockchain...
                  </>
                ) : (
                  <>
                    <span style={{ marginRight: "10px", fontSize: "1.1rem" }}>
                      🔗
                    </span>
                    Start Blockchain Exam
                  </>
                )}
                <span
                  style={{
                    marginRight: "10px",
                    fontSize: "1.1rem"
                  } as React.CSSProperties}
                >
                  📝
                </span>
                Start Exam
              </button>
            </div>
          </form>
        </div>

        <div
          style={{
            marginTop: "40px",
            opacity: "0.7",
            fontSize: "0.9rem"
          } as React.CSSProperties}
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

export default ExamList;