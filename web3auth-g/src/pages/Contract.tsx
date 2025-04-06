import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React, { useState, useEffect } from "react";
import { BrowserProvider, ContractFactory, ethers } from "ethers";

import Console from "../components/Console";
import Form from "../components/Form";
import Header from "../components/Header";
import NotConnectedPage from "../components/NotConnectedPage";
import Sidebar from "../components/Sidebar";
import SourceCode from "../components/SourceCode";
import Tabs from "../components/Tabs";
import ABI from "../config/ABI.json";
import { usePlayground } from "../services/playground";

function Contract() {
  const [abi, setAbi] = useState<string>(JSON.stringify(ABI));
  const [bytecode, setBytecode] = useState<string>(
    "60806040523480156200001157600080fd5b5060405162000bee38038062000bee8339818101604052810190620000379190620001e3565b80600090816200004891906200047f565b505062000566565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620000b9826200006e565b810181811067ffffffffffffffff82111715620000db57620000da6200007f565b5b80604052505050565b6000620000f062000050565b9050620000fe8282620000ae565b919050565b600067ffffffffffffffff8211156200012157620001206200007f565b5b6200012c826200006e565b9050602081019050919050565b60005b83811015620001595780820151818401526020810190506200013c565b60008484015250505050565b60006200017c620001768462000103565b620000e4565b9050828152602081018484840111156200019b576200019a62000069565b5b620001a884828562000139565b509392505050565b600082601f830112620001c857620001c762000064565b5b8151620001da84826020860162000165565b91505092915050565b600060208284031215620001fc57620001fb6200005a565b5b600082015167ffffffffffffffff8111156200021d576200021c6200005f565b5b6200022b84828501620001b0565b91505092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200028757607f821691505b6020821081036200029d576200029c6200023f565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620003077fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002c8565b620003138683620002c8565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620003606200035a62000354846200032b565b62000335565b6200032b565b9050919050565b6000819050919050565b6200037c836200033f565b620003946200038b8262000367565b848454620002d5565b825550505050565b600090565b620003ab6200039c565b620003b881848462000371565b505050565b5b81811015620003e057620003d4600082620003a1565b600181019050620003be565b5050565b601f8211156200042f57620003f981620002a3565b6200040484620002b8565b8101602085101562000414578190505b6200042c6200042385620002b8565b830182620003bd565b50505b505050565b600082821c905092915050565b6000620004546000198460080262000434565b1980831691505092915050565b60006200046f838362000441565b9150826002028217905092915050565b6200048a8262000234565b67ffffffffffffffff811115620004a657620004a56200007f565b5b620004b282546200026e565b620004bf828285620003e4565b600060209050601f831160018114620004f75760008415620004e2578287015190505b620004ee858262000461565b8655506200055e565b601f1984166200050786620002a3565b60005b8281101562000531578489015182556001820191506020850194506020810190506200050a565b868310156200055157848901516200054d601f89168262000441565b8355505b6001600288020188555050505b505050505050565b61067880620005766000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80633d7403a31461003b578063e21f37ce14610057575b600080fd5b61005560048036038101906100509190610270565b610075565b005b61005f610088565b60405161006c9190610338565b60405180910390f35b80600090816100849190610570565b5050565b6000805461009590610389565b80601f01602080910402602001604051908101604052809291908181526020018280546100c190610389565b801561010e5780601f106100e35761010080835404028352916020019161010e565b820191906000526020600020905b8154815290600101906020018083116100f157829003601f168201915b505050505081565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61017d82610134565b810181811067ffffffffffffffff8211171561019c5761019b610145565b5b80604052505050565b60006101af610116565b90506101bb8282610174565b919050565b600067ffffffffffffffff8211156101db576101da610145565b5b6101e482610134565b9050602081019050919050565b82818337600083830152505050565b600061021361020e846101c0565b6101a5565b90508281526020810184848401111561022f5761022e61012f565b5b61023a8482856101f1565b509392505050565b600082601f8301126102575761025661012a565b5b8135610267848260208601610200565b91505092915050565b60006020828403121561028657610285610120565b5b600082013567ffffffffffffffff8111156102a4576102a3610125565b5b6102b084828501610242565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156102f35780820151818401526020810190506102d8565b60008484015250505050565b600061030a826102b9565b61031481856102c4565b93506103248185602086016102d5565b61032d81610134565b840191505092915050565b6000602082019050818103600083015261035281846102ff565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806103a157607f821691505b6020821081036103b4576103b361035a565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b60006008830261041c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826103df565b61042686836103df565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600061046d6104686104638461043e565b610448565b61043e565b9050919050565b6000819050919050565b61048783610452565b61049b61049382610474565b8484546103ec565b825550505050565b600090565b6104b06104a3565b6104bb81848461047e565b505050565b5b818110156104df576104d46000826104a8565b6001810190506104c1565b5050565b601f821115610524576104f5816103ba565b6104fe846103cf565b8101602085101561050d578190505b610521610519856103cf565b8301826104c0565b50505b505050565b600082821c905092915050565b600061054760001984600802610529565b1980831691505092915050565b60006105608383610536565b9150826002028217905092915050565b610579826102b9565b67ffffffffffffffff81111561059257610591610145565b5b61059c8254610389565b6105a78282856104e3565b600060209050601f8311600181146105da57600084156105c8578287015190505b6105d28582610554565b86555061063a565b601f1984166105e8866103ba565b60005b82811015610610578489015182556001820191506020850194506020810190506105eb565b8683101561062d5784890151610629601f891682610536565b8355505b6001600288020188555050505b50505050505056fea2646970667358221220eecabaeaef849ff90aa73071525a5fa1972cd301476f7718a27010569d13051264736f6c63430008120033"
  );
  const [contractValue, setContractValue] = useState<string>("Welcome to Web3Auth");
  const [address, setAddress] = useState("0x28Fd42Ce70427811dE533537B04eF1a137948a81");
  const [loading, setLoading] = useState(false);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [testEndTime, setTestEndTime] = useState<number | null>(null);
  const [siweMessage, setSiweMessage] = useState<string | null>(null);
  const [siweSignature, setSiweSignature] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  
  const [tab, setTab] = useState("deploy");

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

  const { deployContract, readContract, writeContract, signInWithEthereum } = usePlayground();
  const { isConnected, provider } = useWeb3Auth();
  
  // Charger dynamiquement le bytecode du fichier bytecode.txt
  useEffect(() => {
    const loadBytecode = async () => {
      try {
        const response = await fetch('/bytecode.txt');
        if (response.ok) {
          const text = await response.text();
          const formattedBytecode = text.trim().startsWith('0x') ? text.trim() : `0x${text.trim()}`;
          setBytecode(formattedBytecode);
          console.log("✅ Bytecode chargé avec succès");
        } else {
          console.error("❌ Erreur lors du chargement du bytecode:", response.status);
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement du bytecode:", error);
      }
    };
    
    loadBytecode();
  }, []);
  
  // Méthode pour déployer un contrat directement avec ethers.js (implémentation des étapes 1 à 5)
  const deployContractDirect = async () => {
    try {
      setLoading(true);
      
      // Vérifier que le provider est disponible
      if (!provider) {
        console.error("Provider Web3Auth non disponible, connectez-vous d'abord");
        return;
      }
      
      // Étape 2: Convertir le provider pour l'utiliser avec ethers.js
      const ethersProvider = new BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      
      // Étape 3: Charger l'ABI et le Bytecode du contrat
      let parsedAbi;
      try {
        // Pour gérer à la fois l'ABI déjà formaté en JSON ou en string
        parsedAbi = typeof abi === 'string' ? JSON.parse(abi) : abi;
      } catch (e) {
        console.error("Erreur lors du parsing de l'ABI:", e);
        throw new Error("ABI invalide");
      }
      
      // S'assurer que le bytecode a le préfixe 0x
      const bytecodeWithPrefix = bytecode.startsWith('0x') ? bytecode : '0x' + bytecode;
      
      console.log("🔄 Création de la factory de contrat...");
      
      // Étape 4: Créer la ContractFactory et déployer
      const factory = new ContractFactory(parsedAbi, bytecodeWithPrefix, signer);
      
      console.log("🚀 Déploiement du contrat en cours...");
      const contract = await factory.deploy(contractValue);
      
      console.log("⏳ Transaction envoyée, en attente de confirmation...");
      await contract.waitForDeployment();
      
      // Étape 5: Récupérer et stocker l'adresse du contrat
      const contractAddress = await contract.getAddress();
      console.log("✅ Contrat déployé avec succès à l'adresse:", contractAddress);
      
      // Mettre à jour l'interface
      setAddress(contractAddress);
      
      // Afficher l'adresse de l'utilisateur qui a déployé
      const userAddress = await signer.getAddress();
      console.log("👤 Contrat déployé par:", userAddress);
      
      return contract;
    } catch (error) {
      console.error("❌ Erreur lors du déploiement du contrat:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const formDetailsDeploy = [
    {
      label: "Contract ABI",
      input: abi as string,
      onChange: setAbi,
    },
    {
      label: "Contract Bytecode",
      input: bytecode as string,
      onChange: setBytecode,
    },
    {
      label: "Initial Value to Set",
      input: contractValue as string,
      onChange: setContractValue,
    },
  ];
  const formDetailsRead = [
    {
      label: "Contract ABI",
      input: abi as string,
      onChange: setAbi,
    },
    {
      label: "Contract Address",
      input: address as string,
      onChange: setAddress,
    },
  ];
  const formDetailsWrite = [
    {
      label: "Contract ABI",
      input: abi as string,
      onChange: setAbi,
    },
    {
      label: "Contract Address",
      input: address as string,
      onChange: setAddress,
    },
    {
      label: "Value to Update",
      input: contractValue as string,
      onChange: setContractValue,
    },
  ];

  const TabData = [
    {
      tabName: "Deploy Contract",
      onClick: () => setTab("deploy"),
      active: tab === "deploy",
    },
    {
      tabName: "Read from Contract",
      onClick: () => setTab("read"),
      active: tab === "read",
    },
    {
      tabName: "Write to Contract",
      onClick: () => setTab("write"),
      active: tab === "write",
    },
  ];

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isConnected ? (
          <>
            <Sidebar />
            <div className="w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
              <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Smart Contract Interactions</h1>
              <Tabs tabData={TabData} />
              {tab === "deploy" ? (
                <Form formDetails={formDetailsDeploy}>
                  <div className="flex flex-col space-y-4 w-full">
                    <LoaderButton
                      className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                      style={{ backgroundColor: "#f59e0b" }}
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const { message, signature } = await signInWithEthereum();
                          const ethersProvider = new BrowserProvider(provider as any);
                          const signer = await ethersProvider.getSigner();
                          const address = await signer.getAddress();

                          setSiweMessage(message);
                          setSiweSignature(signature);
                          setAddress(address);
                          setTestStartTime(Date.now());

                          alert("✅ Test lancé à " + new Date().toLocaleTimeString());
                        } catch (err) {
                          console.error("Erreur SIWE:", err);
                        }
                        setLoading(false);
                      }}
                    >
                      🔐 Lancer le test (SIWE)
                    </LoaderButton>

                    <Form
                      formDetails={[
                        {
                          label: "Score obtenu (ex: 12)",
                          input: score.toString(),
                          onChange: (v: string) => setScore(parseInt(v)),
                        },
                      ]}
                    >
                      <LoaderButton
                        className="w-full mt-4 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                        style={{ backgroundColor: "#10b981" }}
                        onClick={async () => {
                          setLoading(true);
                          try {
                            const parsedAbi = typeof abi === 'string' ? JSON.parse(abi) : abi;
                            const ethersProvider = new BrowserProvider(provider as any);
                            const signer = await ethersProvider.getSigner();
                            const userAddress = await signer.getAddress();
                            const contract = new ethers.Contract(address, parsedAbi, signer);

                            const totalQuestions = 20;
                            
                            // Vérification des transactions en attente
                            const pending = await ethersProvider.getTransactionCount(userAddress, "pending");
                            const latest = await ethersProvider.getTransactionCount(userAddress, "latest");
                            
                            if (pending > latest) {
                              alert("⏳ Une transaction précédente est encore en attente. Veuillez patienter.");
                              console.log("⏳ Transactions en attente. Attendez que la précédente soit minée !", 
                                { pending, latest });
                              return;
                            }
                            
                            let currentNonce = latest;
                            console.log("📊 Nonce actuel:", currentNonce);
                            
                            // Vérifier que l'initialisation a été faite
                            try {
                              // Comme c'est une démo, on initialise le test directement ici
                              // Dans un cas réel, cela serait fait au début du test
                              const testId = ethers.solidityPackedKeccak256(["string", "uint256"], ["test_certif", Date.now()]);
                              const emailHash = ethers.solidityPackedKeccak256(["string"], ["utilisateur@exemple.com"]);
                              
                              // Créer une signature de consentement en utilisant le SIWE signature
                              const consentSignature = siweSignature 
                                ? ethers.toUtf8Bytes(siweSignature) 
                                : ethers.toUtf8Bytes("Consentement signé avec SIWE");
                              
                              // Initialiser le test avec gas options et nonce explicite
                              await contract.initializeTest(emailHash, testId, consentSignature, {
                                nonce: currentNonce++,
                                gasLimit: 150_000,
                                maxFeePerGas: ethers.parseUnits("7", "gwei"),
                                maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
                              });
                              console.log("✅ Test initialisé avec succès, nonce utilisé:", currentNonce-1);
                              
                              // Attendre un moment pour éviter les conflits de nonce
                              await new Promise((res) => setTimeout(res, 4000));
                              
                              // Démarrer le test avec gas options et nonce explicite
                              await contract.startTest(totalQuestions, {
                                nonce: currentNonce++,
                                gasLimit: 150_000,
                                maxFeePerGas: ethers.parseUnits("7", "gwei"),
                                maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
                              });
                              console.log("✅ Test démarré avec succès, nonce utilisé:", currentNonce-1);
                              
                              // Attendre que les transactions précédentes soient minées
                              await new Promise((res) => setTimeout(res, 5000));
                            } catch (err) {
                              console.warn("Initialisation du test impossible (peut-être déjà fait):", err.message);
                            }

                            // Compléter le test
                            const correctAnswers = score;
                            const fraudScore = 0; // ou à définir plus tard
                            const endTime = Date.now();
                            setTestEndTime(endTime);
                            
                            // Construction des métadonnées avec timestamps
                            // Capture des timestamps précis
                          const nowExact = Math.floor(Date.now() / 1000);
                          const startTimeSeconds = testStartTime ? Math.floor(testStartTime / 1000) : (nowExact - 300);
                          const endTimeSeconds = nowExact;
                          const durationSeconds = endTimeSeconds - startTimeSeconds;
                          
                          // Formatage des timestamps pour affichage
                          const startFormatted = new Date(startTimeSeconds * 1000).toLocaleString("fr-FR", {
                            timeZone: "Europe/Paris",
                            dateStyle: "short",
                            timeStyle: "medium"
                          });
                          const endFormatted = new Date(endTimeSeconds * 1000).toLocaleString("fr-FR", {
                            timeZone: "Europe/Paris",
                            dateStyle: "short",
                            timeStyle: "medium"
                          });
                          
                          const metadata = {
                              startTime: startTimeSeconds,
                              startTimeFormatted: startFormatted,
                              endTime: endTimeSeconds,
                              endTimeFormatted: endFormatted,
                              duration: durationSeconds,
                              durationFormatted: `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`,
                              siweMessage: siweMessage,
                              siweSignature: siweSignature,
                              passed: (score / totalQuestions) >= 0.6,
                              score: score,
                              totalQuestions: totalQuestions,
                              userAddress: userAddress
                            };
                            
                            // En production, on utiliserait IPFS, ici on utilise juste un JSON en local
                            const metadataURI = "ipfs://test-metadata-placeholder";
                            const metadataStr = JSON.stringify(metadata);
                            console.log("📊 Métadonnées du test:", metadataStr);
                            
                            const passed = (score / totalQuestions) >= 0.6;
                            
                            // Créer une signature de consentement à partir du SIWE
                            const consentSignature = siweSignature 
                              ? ethers.toUtf8Bytes(siweSignature) 
                              : ethers.toUtf8Bytes("Consentement signé avec SIWE");
                            
                            // Récupérer un nonce frais pour s'assurer qu'il n'y a pas de conflit
                            const finalNonce = await ethersProvider.getTransactionCount(userAddress, "latest");
                            console.log("📊 Nonce final pour completeTest:", finalNonce);
                            
                            try {
                              // Essayer d'abord avec la version étendue
                              console.log("🧪 Tentative d'utilisation de la version étendue de completeTest");
                              
                              // Création d'un testId déterministe basé sur l'adresse et le timestamp
                              const testId = ethers.solidityPackedKeccak256(
                                ["address", "uint256"], 
                                [userAddress, Math.floor(testStartTime / 1000)]
                              );
                              
                              // Email hash
                              const emailHash = ethers.solidityPackedKeccak256(
                                ["string", "address"], 
                                ["utilisateur@exemple.com", userAddress]
                              );
                              
                              // S'assurer que tous les timestamps sont en secondes et correctement formés
                              // Utiliser le timestamp actuel précis au moment du clic
                              const exactNow = Math.floor(Date.now() / 1000);
                              
                              // Pour le débogage, afficher l'heure locale
                              const localTime = new Date(exactNow * 1000).toLocaleString("fr-FR", { 
                                timeZone: "Europe/Paris",
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false 
                              });
                              console.log(`🕒 Heure exacte du clic: ${localTime} (timestamp: ${exactNow})`);
                              
                              // Utiliser le timestamp du début du test s'il existe (conversion ms → s)
                              const consentTimestamp = testStartTime 
                                ? Math.floor(testStartTime / 1000) 
                                : exactNow - 300; // 5 minutes avant si pas de startTime
                              
                              // Capture de temps précise
                              const startTime = testStartTime 
                                ? Math.floor(testStartTime / 1000) 
                                : consentTimestamp + 30; // 30 secondes après le consentement
                              
                              // Utiliser le timestamp actuel exact pour la fin
                              const endTime = exactNow;
                              
                              // Afficher les conversions pour le débogage
                              const startLocal = new Date(startTime * 1000).toLocaleString("fr-FR", { 
                                timeZone: "Europe/Paris",
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false 
                              });
                              
                              const endLocal = new Date(endTime * 1000).toLocaleString("fr-FR", { 
                                timeZone: "Europe/Paris",
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit', 
                                hour12: false
                              });
                              
                              // Calculer correctement la durée
                              const durationSeconds = endTime - startTime;
                              
                              // Calculer le score au format attendu (0-10000 = 0-100%)
                              const calculatedScore = Math.floor((score / totalQuestions) * 10000); // Format du score attendu par le contrat
                              
                              console.log("📊 Timestamps validés:", {
                                consentTimestamp,
                                startTime, 
                                endTime,
                                durationSeconds,
                                startTimeFormatted: startLocal,
                                endTimeFormatted: endLocal, 
                                testId: testId.toString(),
                                emailHash: emailHash.toString()
                              });
                              
                              // Vérification des valeurs avant transmission
                              if (!testId || !emailHash) {
                                throw new Error("ID de test ou hash d'email invalide");
                              }
                              
                              // Assurer que fraudScore est un nombre entre 0-100
                              const validatedFraudScore = Math.min(Math.max(fraudScore || 0, 0), 100);
                              
                              // Construction d'une string signerData avec les infos SIWE
                              const signerData = JSON.stringify({
                                message: siweMessage || "",
                                signature: siweSignature || "",
                                address: userAddress,
                                timestamp: exactNow,
                                localTime: localTime
                              });
                              
                              console.log("📩 Envoi des données complètes au contrat:", {
                                emailHash: emailHash.toString(),
                                testId: testId.toString(),
                                consentTimestamp,
                                startTime,
                                endTime,
                                durationSeconds,
                                totalQuestions,
                                correctAnswers,
                                calculatedScore,
                                passed,
                                fraudScore: validatedFraudScore
                              });
                              
                              // Utiliser completeTestFull pour enregistrer toutes les données en une fois
                              const tx = await contract.completeTestFull(
                                emailHash,                                  // emailHash
                                testId,                                     // testId
                                consentSignature,                           // consentSignature
                                BigInt(consentTimestamp),                   // consentTimestamp
                                BigInt(startTime),                          // startTime
                                BigInt(endTime),                            // endTime
                                totalQuestions,                             // totalQuestions
                                correctAnswers,                             // correctAnswers
                                validatedFraudScore,                        // fraudScore
                                metadataURI,                                // metadataURI
                                siweMessage || "SIWE Authentication",       // siweMessage
                                {
                                  nonce: finalNonce,
                                  gasLimit: 100_000,                        // Valeur raisonnable selon l'usage réel
                                  gasPrice: ethers.parseUnits("5", "gwei")  // Valeur raisonnable
                                }
                              );
                              console.log("🔄 Transaction étendue envoyée avec le hash:", tx.hash);
                              await tx.wait();
                            } catch (error) {
                              console.warn("❌ Version étendue a échoué, tentative avec version simple:", error.message);
                              
                              // Vérifier si on doit récupérer un nouveau nonce
                              const newNonce = await ethersProvider.getTransactionCount(userAddress, "latest");
                              console.log("🔢 Nouveau nonce pour la version simple:", newNonce);
                              
                              // Essai avec completeTestFull même en cas d'échec de la première tentative
                              try {
                                // Re-création des paramètres pour être sûr
                                const newEmailHash = ethers.solidityPackedKeccak256(
                                  ["string", "address"], 
                                  ["utilisateur@exemple.com", userAddress]
                                );
                                const newTestId = ethers.solidityPackedKeccak256(
                                  ["address", "uint256"], 
                                  [userAddress, Math.floor(Date.now() / 1000)]
                                );
                                
                                // Sécuriser les valeurs numériques
                                const safeCorrectAnswers = Math.min(correctAnswers, totalQuestions);
                                const safeFraudScore = Math.min(Math.max(fraudScore || 0, 0), 100);
                                
                                // Timestamps précis
                                const nowExact = Math.floor(Date.now() / 1000);
                                const safeStartTime = testStartTime 
                                  ? Math.floor(testStartTime / 1000) 
                                  : nowExact - 300; // 5 minutes avant
                                
                                console.log("🔄 Nouvelle tentative avec completeTestFull");
                                
                                // Essai avec completeTestFull même en fallback
                                const tx = await contract.completeTestFull(
                                  newEmailHash,
                                  newTestId,
                                  ethers.toUtf8Bytes("ConsentementFallback"),
                                  BigInt(safeStartTime - 60),    // consentTimestamp juste avant le début
                                  BigInt(safeStartTime),         // startTime
                                  BigInt(nowExact),              // endTime
                                  totalQuestions,
                                  safeCorrectAnswers,
                                  safeFraudScore,
                                  metadataURI,
                                  "SIWE Authentication Fallback",
                                  {
                                    nonce: newNonce,
                                    gasLimit: 100_000,            // Valeur raisonnable
                                    gasPrice: ethers.parseUnits("5.5", "gwei")  // Légèrement plus élevé pour le fallback
                                  }
                                );
                                
                                console.log("🔄 Transaction fallback complète envoyée avec le hash:", tx.hash);
                                await tx.wait();
                              } catch (fallbackError) {
                                console.error("❌❌ Échec de la tentative avec completeTestFull:", fallbackError.message);
                                
                                // Dernier recours : version simple avec completeTest
                                console.log("⚠️ Recours à la méthode simple completeTest");
                                
                                // Sécuriser les valeurs numériques
                                const safeCorrectAnswers = Math.min(correctAnswers, totalQuestions);
                                const safeFraudScore = Math.min(Math.max(fraudScore || 0, 0), 100);
                                const endTimeSeconds = Math.floor(Date.now() / 1000);
                                
                                // Récupérer un nonce vraiment frais
                                const finalNonce = await ethersProvider.getTransactionCount(userAddress, "latest");
                                
                                // Fallback vers la version simple completeTest avec 4 paramètres
                                const tx = await contract.completeTest(
                                  safeCorrectAnswers, 
                                  safeFraudScore, 
                                  metadataURI, 
                                  BigInt(endTimeSeconds), // Timestamp de fin explicite
                                  {
                                    nonce: finalNonce, 
                                    gasLimit: 75_000,              // Valeur encore plus basse pour cette fonction simple
                                    gasPrice: ethers.parseUnits("6", "gwei")  // Légèrement plus élevé pour assurer le passage
                                  }
                                );
                                console.log("🔄 Transaction simple envoyée avec le hash:", tx.hash);
                                await tx.wait();
                              }
                            }
                            
                            // On pourrait également récupérer les informations du test depuis le contrat
                            try {
                              // Récupérer les données de la session de test avec la nouvelle méthode
                              const testSession = await contract.getTestSession(userAddress);
                              console.log("✅ Session de test récupérée:", testSession);
                              
                              // S'adapter au format de retour du contrat
                              const wallet = testSession[0];
                              const emailHash = testSession[1];
                              const testId = testSession[2];
                              const consentTimestamp = Number(testSession[3]);
                              const startTime = Number(testSession[4]);
                              const endTime = Number(testSession[5]);
                              const duration = Number(testSession[6]);
                              const totalQ = Number(testSession[7]);
                              const correctA = Number(testSession[8]);
                              const testScore = Number(testSession[9]);
                              const testPassed = testSession[10];
                              const testStatus = Number(testSession[11]); // enum TestStatus
                              const fraudScore = Number(testSession[12]);
                              const metadataURI = testSession[13];
                              
                              // Convertir le statut numérique en texte
                              const statusText = ['Unset', 'Initialized', 'InProgress', 'Completed', 'Failed'][testStatus] || 'Unknown';
                              
                              // Formater les dates
                              const startDate = new Date(startTime * 1000).toLocaleString();
                              const endDate = new Date(endTime * 1000).toLocaleString();
                              
                              // Afficher les données de manière structurée
                              console.log(`
📊 TEST SUMMARY
==============
👤 Adresse: ${wallet}
🆔 Test ID: 0x${testId.toString(16).substring(0, 8)}...
⏱️ Démarré: ${startDate}
⏱️ Terminé: ${endDate}
⏱️ Durée: ${duration}s
📝 Questions: ${correctA}/${totalQ} (${testScore/100}%)
🚩 Fraude: ${fraudScore}/100
✅ Résultat: ${testPassed ? "RÉUSSI ✅" : "ÉCHOUÉ ❌"}
📌 Status: ${statusText}
🔗 Métadonnées: ${metadataURI}
                              `);
                              
                              // Tenter de récupérer aussi les informations de signature SIWE
                              try {
                                const siweData = await contract.getTestSignature(userAddress);
                                console.log("📝 Données SIWE:", {
                                  message: siweData[0],
                                  signatureStart: siweData[1].slice(0, 20) + "..." // Afficher le début de la signature
                                });
                              } catch (err) {
                                console.warn("⚠️ Impossible de récupérer les données SIWE:", err.message);
                              }
                            } catch (err) {
                              console.warn("❌ Impossible de récupérer les informations du test:", err.message);
                              
                              // Essayer de vérifier d'autres données disponibles
                              try {
                                // Vérifier si l'utilisateur a des tests
                                const testHistory = await contract.getUserTestHistory(userAddress);
                                console.log("📜 Historique des tests:", testHistory);
                                
                                if (Number(testHistory[0]) > 0) {
                                  console.log(`L'utilisateur a ${testHistory[0]} test(s) enregistré(s)`);
                                } else {
                                  console.log("⚠️ Aucun test n'a été enregistré pour cet utilisateur");
                                }
                              } catch (historyErr) {
                                console.warn("❌ Impossible de récupérer l'historique des tests:", historyErr.message);
                              }
                            }

                            alert(`📨 Résultat envoyé ! Test ${passed ? "réussi ✅" : "échoué ❌"}`);
                            console.log(`✅ Métadonnées avec signature SIWE stockées. Résultat: ${passed ? "RÉUSSI" : "ÉCHOUÉ"} (${score}/${totalQuestions}).`);
                          } catch (err) {
                            console.error("Erreur envoi test:", err);
                            alert("❌ Erreur: " + err.message);
                          }
                          setLoading(false);
                        }}
                      >
                        ✅ Terminer le test (envoyer dans le smart contract)
                      </LoaderButton>
                    </Form>
                    
                    <LoaderButton
                      className="w-full mt-4 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                      style={{ backgroundColor: "#0364ff" }}
                      onClick={async () => {
                        setLoading(true);
                        const receipt = await deployContract(abi, bytecode, contractValue);
                        setAddress(receipt.target);
                        setLoading(false);
                      }}
                    >
                      Deploy Contract (via usePlayground)
                    </LoaderButton>
                    
                    <LoaderButton
                      className="w-full mt-4 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                      style={{ backgroundColor: "#2c974b" }}
                      onClick={deployContractDirect}
                    >
                      Deploy Contract Directly (via ethers.js)
                    </LoaderButton>
                  </div>
                </Form>
              ) : null}
              {tab === "read" ? (
                <Form formDetails={formDetailsRead}>
                  <LoaderButton
                    className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                    style={{ backgroundColor: "#0364ff" }}
                    onClick={() => {
                      setLoading(true);
                      readContract(address, abi);
                      setLoading(false);
                    }}
                  >
                    Read from Contract
                  </LoaderButton>
                </Form>
              ) : null}
              {tab === "write" ? (
                <Form formDetails={formDetailsWrite}>
                  <LoaderButton
                    className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                    style={{ backgroundColor: "#0364ff" }}
                    onClick={() => {
                      setLoading(true);
                      writeContract(address, abi, contractValue);
                      setLoading(false);
                    }}
                  >
                    Write to Contract
                  </LoaderButton>
                </Form>
              ) : null}

              <Console />
              <SourceCode />
            </div>
          </>
        ) : (
          <NotConnectedPage />
        )}
      </div>
    </main>
  );
}

export default Contract;
