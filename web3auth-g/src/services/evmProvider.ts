import type { IProvider } from "@web3auth/base";
import { ContractFactory, ethers } from "ethers";
import { IWalletProvider } from "./walletProvider";

const ethersWeb3Provider = (
  provider: IProvider | null,
  uiConsole: (...args: unknown[]) => void
): IWalletProvider => {
  const getPublicKey = async (): Promise<string> => {
    try {
      const pubKey: string = await provider.request({ method: "public_key" });
      return pubKey.slice(2);
    } catch (error: any) {
      uiConsole(error);
      return error.toString();
    }
  };

  const getAddress = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      return await signer.getAddress();
    } catch (error: any) {
      uiConsole(error);
      return error.toString();
    }
  };

  const getChainId = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      return (await ethersProvider.getNetwork()).chainId.toString(16);
    } catch (error: any) {
      uiConsole(error);
      return error.toString();
    }
  };

  const getBalance = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const res = ethers.formatEther(await ethersProvider.getBalance(address));
      return (+res).toFixed(4);
    } catch (error: any) {
      uiConsole(error);
      return error.toString();
    }
  };

  const getSignature = async (message: string): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      return await signer.signMessage(message);
    } catch (error: any) {
      uiConsole(error);
      return error.toString();
    }
  };

  const sendTransaction = async (
    amount: string,
    destination: string
  ): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const amountBigInt = ethers.parseEther(amount);

      const feeData = await ethersProvider.getFeeData();

      const tx = await signer.sendTransaction({
        to: destination,
        value: amountBigInt,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ?? ethers.parseUnits("1", "gwei"),
        maxFeePerGas: feeData.maxFeePerGas ?? ethers.parseUnits("5", "gwei"),
      });

      return `Transaction Hash: ${tx.hash}`;
    } catch (error: any) {
      uiConsole(error);
      return error.toString();
    }
  };

  const getPrivateKey = async (): Promise<string> => {
    try {
      const privateKey = await provider?.request({
        method: "eth_private_key",
      });
      return privateKey as string;
    } catch (error: any) {
      uiConsole(error);
      return error.toString();
    }
  };

  const deployContract = async (
    contractABI: string,
    contractByteCode: string,
    initValue: string
  ): Promise<any> => {
    try {
      // ✅ Créer le provider et le signer
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      
      // Assurer que l'ABI est un objet
      const parsedABI = typeof contractABI === 'string' ? JSON.parse(contractABI) : contractABI;
      
      // Assurer que le bytecode a le préfixe 0x
      const formattedBytecode = contractByteCode.startsWith('0x') ? contractByteCode : `0x${contractByteCode}`;
      
      // ✅ Créer la ContractFactory
      const factory = new ContractFactory(parsedABI, formattedBytecode, signer);
      
      // ✅ Déployer le contrat
      const contract = await factory.deploy(initValue);
      uiConsole("🚀 Déploiement du contrat en cours...");
      uiConsole(`⏳ Transaction envoyée au: ${contract.target}, en attente de confirmation...`);
      
      // ✅ Attendre que le contrat soit réellement déployé
      await contract.waitForDeployment();
      
      const address = await contract.getAddress();
      uiConsole("✅ Contrat déployé avec succès à:", address);
      
      // Informations supplémentaires
      const userAddress = await signer.getAddress();
      uiConsole("👤 Déployé par:", userAddress);
      
      // ✅ Retourner l'objet contract
      return contract;
    } catch (error: any) {
      uiConsole("❌ Erreur lors du déploiement:", error);
      return error.toString();
    }
  };

  const readContract = async (
    contractAddress: string,
    contractABI: any
  ): Promise<any> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      
      // Assurer que l'ABI est un objet
      const parsedABI = typeof contractABI === 'string' ? JSON.parse(contractABI) : contractABI;
      
      // Créer l'instance du contrat
      const contract = new ethers.Contract(contractAddress, parsedABI, signer);
      
      // Récupérer l'adresse de l'utilisateur
      const userAddress = await signer.getAddress();
      
      try {
        // ✅ Essayer d'abord d'appeler getTestStatus si c'est un contrat TestEvaluator
        const result = await contract.getTestStatus(userAddress);
        uiConsole("📊 Statut du test:", result);
        return result;
      } catch (e) {
        // Si getTestStatus n'existe pas, essayer message() pour la compatibilité
        try {
          const message = await contract.message();
          uiConsole("📄 Message:", message);
          return message;
        } catch (innerError) {
          // Si message() n'existe pas, tenter de lire une autre fonction (supposée publique)
          uiConsole("ℹ️ Les fonctions getTestStatus et message n'existent pas sur ce contrat");
          
          // Retourner une description des fonctions disponibles
          const functions = Object.keys(contract.interface.functions);
          uiConsole("🔍 Fonctions disponibles:", functions);
          return `Contrat trouvé à ${contractAddress}, fonctions disponibles: ${functions.join(", ")}`;
        }
      }
    } catch (error: any) {
      uiConsole("❌ Erreur lors de la lecture du contrat:", error);
      return error.toString();
    }
  };

  const writeContract = async (
    contractAddress: string,
    contractABI: any,
    updatedValue: string
  ): Promise<any> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      
      // Assurer que l'ABI est un objet
      const parsedABI = typeof contractABI === 'string' ? JSON.parse(contractABI) : contractABI;
      
      // Créer l'instance du contrat
      const contract = new ethers.Contract(contractAddress, parsedABI, signer);
      
      let tx;
      
      try {
        // ✅ Essayer d'abord d'appeler completeTest si c'est un contrat TestEvaluator
        uiConsole("🔄 Tentative d'appel de completeTest...");
        tx = await contract.completeTest(
          10,             // correctAnswers (10 sur 20)
          5,              // fraudScore (0-100)
          updatedValue    // metadataURI
        );
      } catch (e) {
        // Si completeTest n'existe pas, essayer update() pour la compatibilité
        try {
          uiConsole("🔄 Tentative d'appel de update...");
          tx = await contract.update(updatedValue);
        } catch (innerError) {
          // Si aucune fonction n'existe, essayer la première fonction d'écriture disponible
          const writableFunctions = Object.values(contract.interface.functions)
            .filter(fn => !fn.constant && fn.inputs.length > 0)
            .map(fn => fn.name);
          
          if (writableFunctions.length > 0) {
            const firstMethod = writableFunctions[0];
            uiConsole(`🔄 Tentative d'appel de ${firstMethod}...`);
            tx = await contract[firstMethod](updatedValue);
          } else {
            throw new Error("Aucune fonction d'écriture disponible sur ce contrat");
          }
        }
      }
      
      uiConsole("⏳ Transaction envoyée, en attente de confirmation...");
      const receipt = await tx.wait();
      uiConsole("✅ Transaction confirmée:", receipt.hash);
      
      return receipt;
    } catch (error: any) {
      uiConsole("❌ Erreur lors de l'écriture dans le contrat:", error);
      return error.toString();
    }
  };

  return {
    getAddress,
    getBalance,
    getChainId,
    getSignature,
    sendTransaction,
    getPrivateKey,
    deployContract,
    readContract,
    writeContract,
    getPublicKey,
  };
};

export default ethersWeb3Provider;
