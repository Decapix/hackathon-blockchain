import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import "../App.css";
import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import styles from "./Menu.module.css";

// Import the three area components
import CompanyForm from './company/CompanyForm';
import ResearchForm from './research/ResearchForm';
import UniversityForm from './university/UniversityForm';

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, connect, getUserInfo, provider } = useWeb3Auth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isConnected && provider) {
        try {
          const info = await getUserInfo();
          setUserInfo(info);
        } catch (error) {
          console.error("Error getting user info:", error);
        }
      }
      setIsLoading(false);
    };

    fetchUserInfo();
  }, [isConnected, getUserInfo, provider]);

  const handleSignIn = async () => {
    try {
      await connect();
      // After connection, the useEffect will handle getting the user info
    } catch (error) {
      console.error("Connection error:", error);
    }
  };


  return (
    <div className={styles.menuContainer}>
      <div className={styles.menuCard}>
        <h1 className={styles.menuTitle}>
          <span className={styles.menuTitleBlack}>La</span>
          <span className={styles.menuTitleAccent}>Certif</span>
        </h1>
        
        {isLoading ? (
          // Loading indicator
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
            <p className={styles.loadingText}>Chargement de l'interface...</p>
          </div>
        ) : !isConnected ? (
          // Not connected - Show login button
          <button onClick={handleSignIn} className={styles.menuButton}>
            <span className={styles.menuIcon}>🔑</span>
            Se Connecter
          </button>
        ) : (
          // Connected - Show the three area buttons
          <div className={styles.connectedMenu}>
            <Routes>
              <Route path="/" element={
                <div className={styles.homeButtons}>
                  <h2 className={styles.welcomeText}>Bienvenue {userInfo?.name || "à La Certif"}</h2>
                  <Link to="/university" style={{ textDecoration: 'none', width: "100%" }}>
                    <button className={styles.menuButton}>
                      <span className={styles.menuAreaIcon}>🏛️</span>
                      University Area
                    </button>
                  </Link>
                  <Link to="/research" style={{ textDecoration: 'none', width: "100%" }}>
                    <button className={styles.menuButton}>
                      <span className={styles.menuAreaIcon}>🎓</span>
                      Research Area
                    </button>
                  </Link>
                  <Link to="/company" style={{ textDecoration: 'none', width: "100%" }}>
                    <button className={styles.menuButton}>
                      <span className={styles.menuAreaIcon}>🏢</span>
                      Company Area
                    </button>
                  </Link>
                </div>
              } />
              <Route path="/university" element={<UniversityForm />} />
              <Route path="/company" element={<CompanyForm />} />
              <Route path="/research" element={<ResearchForm />} />
            </Routes>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;