import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React, { useState, useEffect } from "react";

import Console from "../components/Console";
import Form from "../components/Form";
import Header from "../components/Header";
import NotConnectedPage from "../components/NotConnectedPage";
import Sidebar from "../components/Sidebar";
import SourceCode from "../components/SourceCode";
import Tabs from "../components/Tabs";
import { usePlayground } from "../services/playground";
import { initializeTest, startTest } from "../services/testEvaluator";

function Transaction() {
  const { getSignature, sendTransaction, provider, uiConsole } = usePlayground();
  const { isConnected, provider: web3AuthProvider } = useWeb3Auth();
  const [providerStatus, setProviderStatus] = useState("Checking...");
  
  // Use effect to log provider status on component load
  useEffect(() => {
    const checkProvider = () => {
      try {
        if (provider) {
          console.log("Provider available in usePlayground!");
          console.log("Provider type:", typeof provider);
          console.log("Provider keys:", Object.keys(provider));
          setProviderStatus("Available from Playground");
          return;
        }
        
        if (web3AuthProvider) {
          console.log("Provider available in Web3Auth!");
          console.log("Web3Auth Provider type:", typeof web3AuthProvider);
          console.log("Web3Auth Provider keys:", Object.keys(web3AuthProvider));
          setProviderStatus("Available from Web3Auth");
          return;
        }
        
        console.log("No provider available");
        setProviderStatus("Not available");
      } catch (err) {
        console.error("Error checking provider:", err);
        setProviderStatus("Error checking");
      }
    };
    
    checkProvider();
  }, [provider, web3AuthProvider]);

  const [message, setMessage] = useState("Welcome to Web3Auth");
  const [address, setAddress] = useState("0xeaA8Af602b2eDE45922818AE5f9f7FdE50cFa1A8");
  const [amount, setAmount] = useState("0.01");
  const [loading, setLoading] = useState(false);
  const [blockchainLoading, setBlockchainLoading] = useState(false);
  const [blockchainError, setBlockchainError] = useState("");
  const [blockchainSuccess, setBlockchainSuccess] = useState("");
  const [tab, setTab] = useState("signMessage");

  const LoaderButton = ({ ...props }) => (
    <button {...props}>
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {props.children}
    </button>
  );

  const formDetailsSignMessage = [
    {
      label: "message",
      input: message as string,
      onChange: setMessage,
    },
  ];

  const formDetailsDestinationAddress = [
    {
      label: "destination address",
      input: address as string,
      onChange: setAddress,
    },
    {
      label: "amount",
      input: amount as string,
      onChange: setAmount,
    },
  ];

  // Function to deploy the contract and initialize a test
  const handleInitializeTest = async () => {
    // Debug provider state
    console.log("Provider status:", provider ? "Available" : "Not available");
    console.log("Web3Auth provider status:", web3AuthProvider ? "Available" : "Not available");
    console.log("Provider status from state:", providerStatus);
    
    // Choose the best available provider
    let bestProvider = null;
    if (provider) {
      console.log("Using provider from playground");
      bestProvider = provider;
    } else if (web3AuthProvider) {
      console.log("Using provider from Web3Auth directly");
      bestProvider = web3AuthProvider;
    }
    
    // Add detailed debug info to console
    uiConsole("Debug - Provider from playground:", provider ? "Available" : "Not available");
    uiConsole("Debug - Provider from Web3Auth:", web3AuthProvider ? "Available" : "Not available");
    uiConsole("Debug - isConnected:", isConnected);
    
    if (!bestProvider) {
      const errorMsg = "Provider not available. Please make sure you are connected to Web3Auth";
      console.error(errorMsg);
      uiConsole("ERROR:", errorMsg);
      setBlockchainError(errorMsg);
      return;
    }
    
    try {
      setBlockchainLoading(true);
      setBlockchainError("");
      setBlockchainSuccess("");
      
      // Log details for debugging
      uiConsole("Starting contract deployment and initialization...");
      
      // Example values for the test
      const examId = "Blockchain Certification Exam";
      const userEmail = "student@example.com";
      const consentText = "I consent to take this exam and have my results stored on the blockchain";
      
      uiConsole("Using provider to initialize test...");
      
      // Initialize the test on blockchain
      await initializeTest(bestProvider, uiConsole, userEmail, examId, consentText);
      
      uiConsole("Test initialized, now starting test...");
      
      // Start the test with 10 questions
      await startTest(bestProvider, uiConsole, 10);
      
      uiConsole("Test started successfully!");
      
      setBlockchainSuccess("Smart contract deployed, test initialized and started on blockchain successfully!");
    } catch (err: any) {
      const errorMsg = err.message || "Failed to deploy contract or initialize test";
      console.error("Contract initialization error:", err);
      uiConsole("Error:", errorMsg, err);
      setBlockchainError(errorMsg);
    } finally {
      setBlockchainLoading(false);
    }
  };

  const TabData = [
    {
      tabName: "Sign Message",
      onClick: () => setTab("signMessage"),
      active: tab === "signMessage",
    },
    {
      tabName: "Send Transaction",
      onClick: () => setTab("sendTransaction"),
      active: tab === "sendTransaction",
    },
    {
      tabName: "Smart Contract",
      onClick: () => setTab("smartContract"),
      active: tab === "smartContract",
    }
  ];

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {isConnected ? (
          <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
            <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Signing/ Transaction</h1>
            <Tabs tabData={TabData} />
            {tab === "signMessage" ? (
              <Form formDetails={formDetailsSignMessage}>
                <LoaderButton
                  className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                  style={{ backgroundColor: "#0364ff" }}
                  onClick={async () => {
                    setLoading(true);
                    await getSignature(message);
                    setLoading(false);
                  }}
                >
                  Sign Message
                </LoaderButton>
              </Form>
            ) : tab === "sendTransaction" ? (
              <Form formDetails={formDetailsDestinationAddress}>
                <LoaderButton
                  className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                  style={{ backgroundColor: "#0364ff" }}
                  onClick={async () => {
                    setLoading(true);
                    await sendTransaction(amount, address);
                    setLoading(false);
                  }}
                >
                  Send Transaction
                </LoaderButton>
              </Form>
            ) : (
              <div className="w-11/12 max-w-md mx-auto mt-6 flex flex-col items-center">
                {blockchainError && (
                  <div className="w-full mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {blockchainError}
                  </div>
                )}
                
                {blockchainSuccess && (
                  <div className="w-full mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
                    {blockchainSuccess}
                  </div>
                )}
                
                <div className="w-full mb-6 p-6 bg-white rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold mb-4">Initialize TestEvaluator Contract</h2>
                  <p className="text-gray-600 mb-6">
                    This will initialize a new test session on the blockchain using the TestEvaluator 
                    smart contract. The contract will track your test progress, results, and completion status.
                  </p>
                  
                  {/* Show provider status info */}
                  <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200 text-sm">
                    <p className="font-medium mb-1">Provider Status: 
                      <span className={providerStatus.includes("Available") ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                        {providerStatus}
                      </span>
                    </p>
                    <p className="text-gray-600 text-xs">
                      {!providerStatus.includes("Available") ? 
                        "Please make sure you're connected to Web3Auth before proceeding" : 
                        "You're connected and ready to deploy the contract"}
                    </p>
                  </div>
                  
                  <button
                    className="w-full flex justify-center items-center py-3 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
                    onClick={handleInitializeTest}
                    disabled={blockchainLoading || !providerStatus.includes("Available")}
                  >
                    {blockchainLoading ? (
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
                        <span className="mr-2">🔗</span>
                        Initialize Blockchain Test
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            <Console />
            <SourceCode />
          </div>
        ) : (
          <NotConnectedPage />
        )}
      </div>
    </main>
  );
}

export default Transaction;
