import "./App.css";

import { Web3AuthInnerContext, Web3AuthProvider } from "@web3auth/modal-react-hooks";
import { WalletServicesProvider } from "@web3auth/wallet-services-plugin-react-hooks";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Contract from "./pages/Contract";
// HomePage import removed as Menu is now the main page
import AdminPage from "./pages/AdminPage";
// import NFT from "./pages/NFT";
import ServerSideVerification from "./pages/ServerSideVerification";
import Transaction from "./pages/Transaction";
import ExamList from "./pages/ExamList";
import Menu from "./pages/Menu";
import Certifications from "./pages/Certifications";
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
                <Route path="/">
                  <Route index element={<Menu />} />
                  <Route path="admin" element={<AdminPage />} />
                  <Route path="contract" element={<Contract />} />
                  <Route path="transaction" element={<Transaction />} />
                  <Route path="server-side-verification" element={<ServerSideVerification />} />
                  <Route path="exam_list" element={<ExamList />} />
                  {/* Menu is now the index route */}
                  <Route path="certifications" element={<Certifications />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </Playground>
        </WalletServicesProvider>
      </Web3AuthProvider>
    </div>
  );
}

export default App;
