import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import web3AuthLogoWhite from "../assets/web3authLogoWhite.svg";

function HomePage() {
  const { isConnected, connect } = useWeb3Auth();
  const navigate = useNavigate();
  
  // Nous supprimons la redirection automatique
  
  const handleConnect = () => {
    connect().then(() => {
      // Redirection manuelle après connexion réussie
      navigate("/admin");
    });
  };

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isConnected ? (
          <div className="w-full h-full flex flex-col bg-light-bg items-center justify-center">
            <h1 className="text-3xl font-bold text-center text-light-text">Vous êtes connecté !</h1>
            <p className="mt-4 text-light-text">Bienvenue sur notre plateforme sécurisée.</p>
            <div className="mt-8">
              <button
                onClick={() => navigate('/admin')}
                className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary_hover transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Accéder au tableau de bord
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col bg-light-bg items-center justify-center">
            <div className="max-w-3xl px-6 py-16 text-center">
              <h1 className="text-4xl font-extrabold text-light-text sm:text-5xl">
                Bienvenue sur notre plateforme sécurisée
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Connectez-vous avec Web3Auth pour accéder à votre tableau de bord.
              </p>
              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleConnect}
                  className="flex items-center px-6 py-3 text-white rounded-full bg-primary hover:bg-primary_hover transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <img src={web3AuthLogoWhite} alt="Web3Auth Logo" className="w-6 h-6 mr-3" />
                  Se connecter avec Web3Auth
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default HomePage;
