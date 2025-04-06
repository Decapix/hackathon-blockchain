import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import examData from "../question.json";
import "../App.css";
import { usePlayground } from "../services/playground";
import { deployTestEvaluator, initializeTest, startTest } from "../services/testEvaluator";

interface StyleProps {
  [key: string]: string | number | StyleProps;
}

const ExamList: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [exams, setExams] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();
  const { provider, uiConsole } = usePlayground();

  useEffect(() => {
    // Load the exam data from question.json
    setExams(examData);
  }, []);

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExam(e.target.value);
  };

  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExam && provider) {
      try {
        setLoading(true);
        setError("");
        setSuccess("");
        
        // Step 2: Initialize the test with user data
        const userEmail = "student@example.com"; // In a real app, get this from the user
        const consentText = "I consent to take this exam and have my results stored on blockchain";
        
        await initializeTest(provider, uiConsole, userEmail, selectedExam, consentText);
        
        // Step 3: Start the test with number of questions
        await startTest(provider, uiConsole, 10); // Assuming 10 questions
        
        setSuccess(`Successfully initialized and started exam "${selectedExam}" on blockchain`);
        console.log(`Selected exam: ${selectedExam}`);
        
        // Uncomment to navigate to exam page
        // navigate(`/exam/${selectedExam}`);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to start exam on blockchain");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackClick = (): void => {
    navigate("/menu");
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
          List of <span style={{ color: "#00c3ff" }}>Exams</span>
        </h1>
        
        {error && (
          <div style={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "rgba(255, 87, 87, 0.1)",
            border: "1px solid #ff5757",
            borderRadius: "10px",
            color: "#ff5757"
          } as React.CSSProperties}>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}
        
        {success && (
          <div style={{
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "rgba(46, 213, 115, 0.1)",
            border: "1px solid #2ed573",
            borderRadius: "10px",
            color: "#2ed573"
          } as React.CSSProperties}>
            <p style={{ margin: 0 }}>{success}</p>
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
          
          <form onSubmit={handleStartExam}>
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
                disabled={!selectedExam || loading}
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