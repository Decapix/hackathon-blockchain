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
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      const factory = new ContractFactory(JSON.parse(contractABI), contractByteCode, signer);

      const contract = await factory.deploy(initValue);
      uiConsole("Contract:", contract);
      uiConsole(`Deploying Contract at Target: ${contract.target}, waiting for confirmation...`);

      const receipt = await contract.waitForDeployment();
      uiConsole("Contract Deployed. Receipt:", receipt);

      return receipt;
    } catch (error: any) {
      uiConsole(error);
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
      const contract = new ethers.Contract(contractAddress, JSON.parse(contractABI), signer);

      const message = await contract.message();
      return message;
    } catch (error: any) {
      uiConsole(error);
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
      const contract = new ethers.Contract(contractAddress, JSON.parse(JSON.stringify(contractABI)), signer);

      const tx = await contract.update(updatedValue);
      const receipt = await tx.wait();
      return receipt;
    } catch (error: any) {
      uiConsole(error);
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
