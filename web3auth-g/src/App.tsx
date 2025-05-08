import "./App.css";
import { Web3AuthInnerContext, Web3AuthProvider } from "@web3auth/modal-react-hooks";
import { WalletServicesProvider } from "@web3auth/wallet-services-plugin-react-hooks";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Contract from "./pages/Contract";
import AdminPage from "./pages/AdminPage";
import ServerSideVerification from "./pages/ServerSideVerification";
import Transaction from "./pages/Transaction";
import ExamList from "./pages/ExamList";
import Menu from "./pages/Menu";
import Certifications from "./pages/Certifications";
// Importez ici vos composants de formulaire
import UniversityForm from "./pages/university/UniversityForm"; // Ajustez le chemin selon votre structure
import CompanyForm from "./pages/company/CompanyForm"; // Ajustez le chemin selon votre structure
import ResearchForm from "./pages/research/ResearchForm"; // Ajustez le chemin selon votre structure
import { Playground } from "./services/playground";
import web3AuthContextConfig from "./services/web3authContext";

function App() {
  return (
    <div>
      <Web3AuthProvider config={web3AuthContextConfig}>
        <WalletServicesProvider context={Web3AuthInnerContext}>
          <Playground>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/contract" element={<Contract />} />
                <Route path="/transaction" element={<Transaction />} />
                <Route path="/server-side-verification" element={<ServerSideVerification />} />
                <Route path="/exam_list" element={<ExamList />} />
                <Route path="/certifications" element={<Certifications />} />
                <Route path="/university" element={<UniversityForm />} />
                <Route path="/company" element={<CompanyForm />} />
                <Route path="/research" element={<ResearchForm />} />
              </Routes>
            </BrowserRouter>
          </Playground>
        </WalletServicesProvider>
      </Web3AuthProvider>
    </div>
  );
}

export default App;
